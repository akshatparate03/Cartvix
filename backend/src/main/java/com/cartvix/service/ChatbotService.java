package com.cartvix.service;

import com.cartvix.dto.ChatMessageDto;
import com.cartvix.model.Product;
import com.cartvix.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * FEATURE: AI chatbot for Cartvix — answers platform + product queries.
 * Uses OpenRouter's chat-completions API (works with any OpenRouter model,
 * including free ones). Replies in whatever language/style the user wrote
 * in, but always in the Latin/English script (never Devanagari).
 */
@Service
public class ChatbotService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${app.chat.openrouter-api-key:}")
    private String apiKey;

    // FEATURE: model is configurable via application.properties so you can
    // swap free models without touching code. Verify current free models at
    // openrouter.ai/models (free-model availability rotates over time).
    @Value("${app.chat.openrouter-model:meta-llama/llama-3.3-70b-instruct:free}")
    private String model;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    // Filler/stopwords (English + Hinglish) skipped while pulling keywords
    // out of a natural-language question for the product search fallback.
    private static final Set<String> STOPWORDS = Set.of(
            "the", "is", "are", "a", "an", "of", "for", "and", "to", "on", "in",
            "what", "which", "how", "do", "does", "can", "you", "i", "me", "my",
            "please", "want", "need", "show", "tell", "about", "price", "cost",
            "mujhe", "chahiye", "hai", "ka", "ki", "ke", "kya", "kaise", "batao",
            "batado", "kar", "karo", "mein", "se", "hain", "wala", "wale",
            "product", "products", "item", "items", "available");

    public String getReply(String userMessage, List<ChatMessageDto> history) {
        if (userMessage == null || userMessage.isBlank())
            throw new RuntimeException("Message cannot be empty");
        if (apiKey == null || apiKey.isBlank())
            throw new RuntimeException("Chat assistant is not configured yet. Please try again later.");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", buildSystemPrompt(userMessage)));

        // keep only the last 6 turns of history to control token usage
        if (history != null && !history.isEmpty()) {
            int from = Math.max(0, history.size() - 6);
            for (ChatMessageDto h : history.subList(from, history.size())) {
                if (h.getRole() == null || h.getContent() == null)
                    continue;
                String role = "assistant".equalsIgnoreCase(h.getRole()) ? "assistant" : "user";
                messages.add(Map.of("role", role, "content", h.getContent()));
            }
        }
        messages.add(Map.of("role", "user", "content", userMessage));

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("temperature", 0.4);
        body.put("max_tokens", 500);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("X-Title", "Cartvix Assistant");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, request, Map.class);
            Map<?, ?> respBody = response.getBody();
            List<?> choices = (List<?>) respBody.get("choices");
            if (choices == null || choices.isEmpty())
                throw new RuntimeException("No response from assistant");
            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
            Map<?, ?> messageObj = (Map<?, ?>) firstChoice.get("message");
            String reply = (String) messageObj.get("content");
            return reply != null ? reply.trim() : "Sorry, I couldn't understand that.";
        } catch (Exception e) {
            throw new RuntimeException("Chat assistant is temporarily unavailable. Please try again.");
        }
    }

    private String buildSystemPrompt(String userMessage) {
        List<Product> matches = findRelevantProducts(userMessage);
        String productContext = matches.isEmpty()
                ? "No specific products matched this query."
                : matches.stream()
                        .map(p -> String.format("- %s | Category: %s | Price: Rs.%.0f | %s",
                                p.getTitle(), p.getCategory(), p.getPrice(),
                                shortDesc(p.getDescription())))
                        .collect(Collectors.joining("\n"));

        return """
                You are "Cartvix Assistant", the official AI support and shopping assistant for Cartvix — an Indian fashion e-commerce platform.

                PLATFORM FACTS (use these to answer accurately, do not invent extra facts):
                - Cartvix sells: Shoes, Shirts, T-Shirts, Caps, Goggles, Jewellery, Jeans, Pants, Tops, Froks, Watches, Bags and more.
                - Users browse products, add to cart, and checkout (Cash on Delivery / other configured payment methods).
                - Accounts: CUSTOMER (shops normally) or SELLER (lists/manages own products via "My Products" dashboard). Login/Register via Gmail OTP or Google Sign-In.
                - Order tracking stages in order: Placed -> Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered. Visible under "My Orders".
                - Sellers manage only their own listings; the platform admin manages the whole catalog.
                - Cartvix offers a 7-day easy return/exchange policy.
                - For anything you cannot resolve, tell the user to check "My Orders" or contact support.

                BEHAVIOR RULES (follow strictly):
                1. Only answer questions related to Cartvix — the platform, its products, how to use it, cart, checkout, orders, tracking, returns, or seller/customer accounts. For unrelated questions (general knowledge, coding, etc.), politely say you can only help with Cartvix-related queries.
                2. LANGUAGE MATCHING is critical:
                   - Reply in the SAME language/style the user used.
                   - If they wrote in English, reply fully in English.
                   - If they wrote in Hindi/Hinglish (Hindi mixed with English, typed in Roman letters), reply in that same Hinglish style.
                   - If they wrote in any other language, reply in that language.
                   - Regardless of which language you reply in, ALWAYS use the English/Latin alphabet (A-Z) only. NEVER use Devanagari or any other non-Latin script.
                3. Keep replies short, friendly and helpful — a few sentences or short bullet points, not long essays.
                4. Use the "MATCHING PRODUCTS" list below to answer product questions (price, category, availability). If it's empty and the user asks about a specific product, say it wasn't found and suggest browsing/searching the site.
                5. Never invent prices, discounts, order status, or delivery dates that were not given to you.

                MATCHING PRODUCTS:
                %s
                """
                .formatted(productContext);
    }

    private String shortDesc(String desc) {
        if (desc == null || desc.isBlank())
            return "";
        return desc.length() > 100 ? desc.substring(0, 100) + "..." : desc;
    }

    private List<Product> findRelevantProducts(String userMessage) {
        LinkedHashSet<Product> results = new LinkedHashSet<>();
        try {
            results.addAll(productRepository.searchProducts(userMessage.trim()));
            if (results.size() < 5) {
                for (String word : userMessage.split("\\s+")) {
                    if (results.size() >= 8)
                        break;
                    String w = word.replaceAll("[^a-zA-Z0-9]", "");
                    if (w.length() < 3 || STOPWORDS.contains(w.toLowerCase()))
                        continue;
                    results.addAll(productRepository.searchProducts(w));
                }
            }
        } catch (Exception ignored) {
            // if product search fails for any reason, just answer without product context
        }
        return results.stream().limit(8).collect(Collectors.toList());
    }
}