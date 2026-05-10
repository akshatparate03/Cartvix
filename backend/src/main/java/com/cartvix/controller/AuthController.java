package com.cartvix.controller;

import com.cartvix.dto.*;
import com.cartvix.service.AuthService;
import com.cartvix.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private GoogleAuthService googleAuthService;

    /* ── Normal OTP registration ───────────────────────────────────────── */

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest req) {
        try {
            authService.sendOtp(req);
            return ResponseEntity.ok(new ApiResponse(true, "OTP sent to your Gmail address."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest req) {
        try {
            authService.verifyOtp(req);
            return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            AuthResponse res = authService.register(req);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            AuthResponse res = authService.login(req);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /* ── Google OAuth2 (one-tap / popup) ──────────────────────────────── */

    /**
     * POST /api/auth/google
     * Body: { "credential": "<Google ID token>" }
     *
     * Called by frontend after Google Sign-In popup succeeds.
     * Works for both Login AND Register — auto-creates account if new user.
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest req) {
        try {
            AuthResponse res = googleAuthService.loginWithGoogle(req);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
