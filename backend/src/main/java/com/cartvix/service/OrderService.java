package com.cartvix.service;

import com.cartvix.dto.OrderRequest;
import com.cartvix.model.*;
import com.cartvix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    // FEATURE: fixed manual-tracking stages, in the order they should
    // progress through. Frontend renders these as a straight-line stepper
    // with a checkmark on every completed stage. Keep this list in sync
    // with the STAGES array used on the frontend tracker component.
    public static final List<String> TRACKING_STAGES = List.of(
            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED");

    public Order placeOrder(String email, OrderRequest req) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Order order = Order.builder()
                .user(user).fullName(req.getFullName()).phone(req.getPhone())
                .shippingAddress(req.getShippingAddress()).paymentMethod(req.getPaymentMethod())
                .totalAmount(req.getTotalAmount()).status("PLACED").build();
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // FEATURE: used by the admin "Manage Orders" panel — returns every
    // order on the platform, most recent first.
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        orders.sort(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return orders;
    }

    // FEATURE: manual tracking update — admin moves an order to a new
    // stage. Validates the stage name, stamps the update time, and appends
    // an entry to the JSON tracking history so the timeline shows exactly
    // when each stage was reached.
    public Order updateOrderStatus(Long orderId, String newStatus) {
        if (newStatus == null || newStatus.isBlank())
            throw new RuntimeException("Status is required");

        String normalized = newStatus.trim().toUpperCase();
        if (!TRACKING_STAGES.contains(normalized))
            throw new RuntimeException("Invalid status. Must be one of: " + TRACKING_STAGES);

        Order order = getOrderById(orderId);

        // No-op if it's already at this stage — avoids duplicate history entries.
        if (normalized.equals(order.getStatus())) {
            return order;
        }

        order.setStatus(normalized);
        order.setStatusUpdatedAt(LocalDateTime.now());
        order.setTrackingHistory(appendHistoryEntry(order.getTrackingHistory(), normalized));
        return orderRepository.save(order);
    }

    // Manually builds/extends the tracking_history JSON array — kept as a
    // plain TEXT column (no extra table) since it's just an append-only log.
    private String appendHistoryEntry(String existingJson, String status) {
        String entry = "{\"status\":\"" + status + "\",\"timestamp\":\"" + LocalDateTime.now() + "\"}";
        if (existingJson == null || existingJson.isBlank() || !existingJson.trim().endsWith("]")) {
            return "[" + entry + "]";
        }
        String trimmed = existingJson.trim();
        String withoutClosingBracket = trimmed.substring(0, trimmed.length() - 1);
        String separator = withoutClosingBracket.endsWith("[") ? "" : ",";
        return withoutClosingBracket + separator + entry + "]";
    }
}