package com.cartvix.service;

import com.cartvix.dto.AuthResponse;
import com.cartvix.dto.GoogleAuthRequest;
import com.cartvix.dto.UserDto;
import com.cartvix.model.User;
import com.cartvix.repository.UserRepository;
import com.cartvix.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private static final String GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthResponse loginWithGoogle(GoogleAuthRequest req) {

        if (req.getCredential() == null || req.getCredential().isBlank())
            throw new RuntimeException("Invalid Google credential");

        // ── Step 1: Verify Google ID token ──────────────────────────────────
        // FIX: Use ParameterizedTypeReference<Map<String, Object>> instead of
        // raw Map.class — this eliminates the "Map is a raw type" warning
        // while keeping full type safety on the response body.
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map<String, Object>> response;
        try {
            response = restTemplate.exchange(
                    GOOGLE_TOKENINFO_URL + req.getCredential(),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });
        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed: " + e.getMessage());
        }

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null)
            throw new RuntimeException("Failed to verify Google token");

        Map<String, Object> payload = response.getBody();

        // ── Step 2: Validate audience matches our Client ID ─────────────────
        String aud = (String) payload.get("aud");
        if (!googleClientId.equals(aud))
            throw new RuntimeException("Token audience mismatch — possible token forgery");

        // ── Step 3: Extract user info ────────────────────────────────────────
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        String verified = (String) payload.get("email_verified");

        if (email == null || !Boolean.parseBoolean(verified))
            throw new RuntimeException("Google email not verified");

        if (!email.endsWith("@gmail.com"))
            throw new RuntimeException("Only Gmail addresses are allowed");

        // ── Step 4: Find or auto-create user ────────────────────────────────
        Optional<User> existing = userRepository.findByEmail(email);
        User user;

        if (existing.isPresent()) {
            user = existing.get();
            if (!user.isVerified()) {
                user.setVerified(true);
                userRepository.save(user);
            }
        } else {
            user = User.builder()
                    .fullName(name != null ? name : email.split("@")[0])
                    .email(email)
                    .password(UUID.randomUUID().toString())
                    .verified(true)
                    .build();
            userRepository.save(user);
        }

        // ── Step 5: Issue our JWT ────────────────────────────────────────────
        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();

        return AuthResponse.builder().token(token).user(userDto).build();
    }
}