package com.cartvix.service;

import com.cartvix.dto.OrderRequest;
import com.cartvix.model.*;
import com.cartvix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

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
}
