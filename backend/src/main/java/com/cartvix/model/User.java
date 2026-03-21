package com.cartvix.model;

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
    private String password;

    // FIX: Renamed from isVerified → verified
    // Lombok @Data generates isVerified() getter for boolean isVerified,
    // but JPA maps it to a column "is_verified" which can conflict.
    // Using @Column(name="is_verified") + plain field name "verified" fixes both warnings.
    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private boolean verified = false;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
