package com.cartvix.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;

    // FEATURE: "CUSTOMER" or "SELLER" — sent to frontend so the UI can show
    // seller-only actions (Add Product, Edit, Delete) without extra calls.
    private String role;
}