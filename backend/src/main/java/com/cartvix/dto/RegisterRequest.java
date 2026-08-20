package com.cartvix.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String otp;

    // FEATURE: "CUSTOMER" or "SELLER" — chosen on the registration page.
    // Defaults to "CUSTOMER" in AuthService if left null/blank/invalid.
    private String role;
}