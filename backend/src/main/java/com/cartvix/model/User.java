package com.cartvix.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    // SECURITY FIX: this entity is returned directly inside Order/CartItem
    // responses and the new admin dashboard — @JsonIgnore keeps the password
    // hash out of every API response without touching how login/register work.
    @JsonIgnore
    private String password;

    // FIX: Renamed from isVerified → verified
    // Lombok @Data generates isVerified() getter for boolean isVerified,
    // but JPA maps it to a column "is_verified" which can conflict.
    // Using @Column(name="is_verified") + plain field name "verified" fixes both
    // warnings.
    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

    // FEATURE: Account type — "CUSTOMER" (default) or "SELLER".
    // Sellers get product management access (add/edit/delete their own listings),
    // similar to how the hardcoded admin currently works.
    @Column(nullable = false)
    @Builder.Default
    private String role = "CUSTOMER";

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }
}