package com.cartvix.controller;

import com.cartvix.dto.*;
import com.cartvix.model.Order;
import com.cartvix.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private static final String ADMIN_EMAIL = "akshatparate@gmail.com";

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest req, Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.placeOrder(auth.getName(), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
    }

    // FEATURE: order detail + live tracking view. Only the order's owner or
    // the admin can view it (prevents users guessing other people's order IDs).
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id, Authentication auth) {
        try {
            Order order = orderService.getOrderById(id);
            boolean isOwner = order.getUser() != null && order.getUser().getEmail().equals(auth.getName());
            boolean isAdmin = ADMIN_EMAIL.equals(auth.getName());
            if (!isOwner && !isAdmin)
                return ResponseEntity.status(403).body(new ApiResponse(false, "Not authorized to view this order"));
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // FEATURE: admin's "Manage Orders" panel — every order on the platform.
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // FEATURE: admin manually advances an order's tracking stage
    // (PLACED → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED).
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest req,
            Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, req.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}