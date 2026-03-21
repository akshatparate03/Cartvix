package com.cartvix.controller;

import com.cartvix.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tryon")
public class TryOnController {

    @Value("${app.tryon.api-url:}")
    private String tryOnApiUrl;

    @Value("${app.tryon.api-key:}")
    private String tryOnApiKey;

    @PostMapping("/generate")
    public ResponseEntity<?> generateTryOn(
            @RequestParam("image") MultipartFile image,
            @RequestParam("productId") Long productId,
            Authentication auth) {
        try {
            // If a real API key is configured, call the actual AI API
            if (tryOnApiKey != null
                    && !tryOnApiKey.isEmpty()
                    && !tryOnApiKey.equals("your_fashn_ai_api_key")) {

                RestTemplate restTemplate = new RestTemplate();

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + tryOnApiKey);
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("person_image", image.getResource());
                body.add("product_id", productId.toString());

                HttpEntity<MultiValueMap<String, Object>> requestEntity =
                        new HttpEntity<>(body, headers);

                // FIX: Use parameterized Map<String, Object> instead of raw Map
                // to eliminate "Map is a raw type" warning
                @SuppressWarnings("unchecked")
                ResponseEntity<Map<String, Object>> response =
                        (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>)
                        restTemplate.postForEntity(tryOnApiUrl, requestEntity, Map.class);

                if (response.getStatusCode().is2xxSuccessful()
                        && response.getBody() != null) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("resultImageUrl", response.getBody().get("output_image"));
                    return ResponseEntity.ok(result);
                }
            }

            // Demo / fallback mode — no real API key set
            Map<String, Object> result = new HashMap<>();
            result.put("resultImageUrl",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500");
            result.put("message",
                    "Demo mode: configure app.tryon.api-key in application.properties for real try-on");
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Try-on failed: " + e.getMessage()));
        }
    }
}
