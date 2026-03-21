package com.cartvix.service;

import com.cartvix.dto.*;
import com.cartvix.model.User;
import com.cartvix.repository.UserRepository;
import com.cartvix.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private OtpService otpService;

    private static final String GMAIL_REGEX = "^[a-zA-Z0-9._%+\\-]+@gmail\\.com$";

    public void sendOtp(OtpRequest req) {
        if (!req.getEmail().matches(GMAIL_REGEX))
            throw new RuntimeException("Only Gmail addresses are allowed for registration.");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("An account with this email already exists.");
        otpService.sendOtp(req.getEmail(), req.getFullName());
    }

    public void verifyOtp(OtpVerifyRequest req) {
        otpService.verifyOtp(req.getEmail(), req.getOtp());
    }

    public AuthResponse register(RegisterRequest req) {
        if (!req.getEmail().matches(GMAIL_REGEX))
            throw new RuntimeException("Only Gmail addresses are allowed.");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("An account with this email already exists.");
        if (!otpService.isVerified(req.getEmail()))
            throw new RuntimeException("Email not verified. Please verify OTP first.");

        // FIX: field is now "verified" (not "isVerified") to match the fixed User entity
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .verified(true)
                .build();

        userRepository.save(user);
        otpService.clearOtp(req.getEmail());

        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
        return AuthResponse.builder().token(token).user(userDto).build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        // FIX: use isVerified() getter (Lombok generates this from field "verified")
        if (!user.isVerified())
            throw new RuntimeException("Account not verified");

        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
        return AuthResponse.builder().token(token).user(userDto).build();
    }
}
