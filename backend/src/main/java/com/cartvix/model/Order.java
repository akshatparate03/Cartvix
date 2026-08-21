package com.cartvix.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fullName;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;

    private String paymentMethod;
    private Double totalAmount;

    // FIX: @Builder.Default keeps "PLACED" as the default when using builder
    @Builder.Default
    private String status = "PLACED";

    // FEATURE: timestamp of the last time `status` changed. Shown on the
    // tracking page ("Last updated: ...").
    private LocalDateTime statusUpdatedAt;

    // FEATURE: JSON array log of every stage the order has passed through,
    // e.g. [{"status":"PLACED","timestamp":"..."},
    // {"status":"SHIPPED","timestamp":"..."}]
    // Built up manually as the admin advances the order (see OrderService).
    @Column(columnDefinition = "TEXT")
    private String trackingHistory;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
        if (statusUpdatedAt == null)
            statusUpdatedAt = createdAt;
        if (trackingHistory == null || trackingHistory.isBlank()) {
            String initialStatus = (status == null || status.isBlank()) ? "PLACED" : status;
            trackingHistory = "[{\"status\":\"" + initialStatus + "\",\"timestamp\":\"" + createdAt + "\"}]";
        }
    }
}