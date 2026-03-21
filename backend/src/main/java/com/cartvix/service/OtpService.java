package com.cartvix.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OtpService — sends OTP via Google Apps Script (primary) or
 * falls back to printing in console (dev mode).
 *
 * The Apps Script URL is set in application.properties:
 *   app.otp.apps-script-url=https://script.google.com/macros/s/...
 */
@Service
public class OtpService {

    @Value("${app.otp.apps-script-url:}")
    private String appsScriptUrl;

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts:3}")
    private int maxAttempts;

    /* ── In-memory OTP store ── */
    private static class OtpEntry {
        final String otp;
        final LocalDateTime expiry;
        int attempts = 0;
        boolean verified = false;

        OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    /* ── Send OTP ── */
    public void sendOtp(String email, String fullName) {
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(expiryMinutes)));

        boolean sent = false;

        // 1️⃣  Try Google Apps Script (your deployed URL)
        if (appsScriptUrl != null && !appsScriptUrl.isBlank()) {
            sent = sendViaAppsScript(email, fullName, otp);
        }

        // 2️⃣  Dev fallback — print to console
        if (!sent) {
            System.out.println("==============================================");
            System.out.println("  [Cartvix OTP]  " + email + "  →  " + otp);
            System.out.println("  (Expires in " + expiryMinutes + " minutes)");
            System.out.println("==============================================");
        }
    }

    /* ── Verify OTP ── */
    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null)
            throw new RuntimeException("OTP expired. Please request a new one.");
        if (entry.expiry.isBefore(LocalDateTime.now())) {
            otpStore.remove(email);
            throw new RuntimeException("OTP expired. Please request a new one.");
        }
        if (entry.attempts >= maxAttempts)
            throw new RuntimeException("Too many attempts. Please request a new OTP.");

        entry.attempts++;
        if (!entry.otp.equals(otp))
            throw new RuntimeException("Invalid OTP. Please try again.");

        entry.verified = true;
        return true;
    }

    public boolean isVerified(String email) {
        OtpEntry entry = otpStore.get(email);
        return entry != null && entry.verified;
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }

    /* ── Internal: call Google Apps Script ── */
    private boolean sendViaAppsScript(String email, String fullName, String otp) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Payload matches what CartvixOTP.js expects
            Map<String, String> payload = new HashMap<>();
            payload.put("email",    email);
            payload.put("fullName", fullName);
            payload.put("otp",      otp);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(appsScriptUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("[Cartvix] OTP sent via Apps Script to " + email);
                return true;
            }
        } catch (Exception e) {
            System.err.println("[Cartvix] Apps Script OTP failed: " + e.getMessage());
        }
        return false;
    }
}
