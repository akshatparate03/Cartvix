package com.cartvix.controller;

import com.cartvix.dto.ApiResponse;
import com.cartvix.model.Order;
import com.cartvix.model.Product;
import com.cartvix.model.User;
import com.cartvix.repository.OrderRepository;
import com.cartvix.repository.ProductRepository;
import com.cartvix.repository.UserRepository;
import com.cartvix.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * FEATURE: Master Admin Dashboard — a single endpoint that aggregates
 * platform-wide numbers (users, sellers, products, orders, revenue,
 * order-stage breakdown, etc.) so the admin can see the whole business
 * at a glance without hopping between separate pages.
 *
 * Admin-only, same pattern used across ProductController/OrderController
 * (hardcoded ADMIN_EMAIL check rather than a Spring Security role, to stay
 * consistent with the rest of the codebase).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;

    private static final String ADMIN_EMAIL = "akshatparate@gmail.com";

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));

        try {
            List<User> allUsers = userRepository.findAll();
            List<Product> allProducts = productRepository.findAll();
            List<Order> allOrders = orderRepository.findAll();

            // ── User breakdown ──────────────────────────────────────────
            long totalUsers = allUsers.size();
            long totalSellers = allUsers.stream()
                    .filter(u -> "SELLER".equalsIgnoreCase(u.getRole()))
                    .count();
            long totalCustomers = totalUsers - totalSellers;

            // ── Product breakdown ───────────────────────────────────────
            long totalProducts = allProducts.size();
            long adminProducts = allProducts.stream()
                    .filter(p -> p.getSellerId() == null)
                    .count();
            long sellerProducts = totalProducts - adminProducts;

            Map<String, Long> productsByCategory = allProducts.stream()
                    .collect(Collectors.groupingBy(
                            Product::getCategory,
                            LinkedHashMap::new,
                            Collectors.counting()));
            // Sort categories by count, descending
            Map<String, Long> sortedCategories = productsByCategory.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .collect(Collectors.toMap(
                            Map.Entry::getKey, Map.Entry::getValue,
                            (a, b) -> a, LinkedHashMap::new));

            // ── Order breakdown ─────────────────────────────────────────
            long totalOrders = allOrders.size();
            double totalRevenue = allOrders.stream()
                    .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                    .sum();
            double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;

            // Count of orders currently sitting at each manual tracking stage
            Map<String, Long> ordersByStage = new LinkedHashMap<>();
            for (String stage : OrderService.TRACKING_STAGES) {
                long count = allOrders.stream().filter(o -> stage.equals(o.getStatus())).count();
                ordersByStage.put(stage, count);
            }

            // ── Recent activity ─────────────────────────────────────────
            List<Order> recentOrders = allOrders.stream()
                    .sorted(Comparator.comparing(Order::getCreatedAt,
                            Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(8)
                    .collect(Collectors.toList());

            List<User> recentUsers = allUsers.stream()
                    .sorted(Comparator.comparing(User::getCreatedAt,
                            Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(8)
                    .collect(Collectors.toList());

            // ── Top sellers by number of products listed ────────────────
            Map<Long, Long> sellerProductCounts = allProducts.stream()
                    .filter(p -> p.getSellerId() != null)
                    .collect(Collectors.groupingBy(Product::getSellerId, Collectors.counting()));

            List<Map<String, Object>> topSellers = sellerProductCounts.entrySet().stream()
                    .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                    .limit(5)
                    .map(entry -> {
                        User seller = userRepository.findById(entry.getKey()).orElse(null);
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("sellerId", entry.getKey());
                        m.put("sellerName", seller != null ? seller.getFullName() : "Unknown Seller");
                        m.put("sellerEmail", seller != null ? seller.getEmail() : "");
                        m.put("productCount", entry.getValue());
                        return m;
                    })
                    .collect(Collectors.toList());

            // ── Assemble response ───────────────────────────────────────
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("totalUsers", totalUsers);
            response.put("totalSellers", totalSellers);
            response.put("totalCustomers", totalCustomers);
            response.put("totalProducts", totalProducts);
            response.put("adminProducts", adminProducts);
            response.put("sellerProducts", sellerProducts);
            response.put("productsByCategory", sortedCategories);
            response.put("totalOrders", totalOrders);
            response.put("totalRevenue", totalRevenue);
            response.put("avgOrderValue", avgOrderValue);
            response.put("ordersByStage", ordersByStage);
            response.put("recentOrders", recentOrders);
            response.put("recentUsers", recentUsers);
            response.put("topSellers", topSellers);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}