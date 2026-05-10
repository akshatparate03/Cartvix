package com.cartvix.controller;

import com.cartvix.dto.*;
import com.cartvix.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest req, Authentication auth) {
        try {
            return ResponseEntity.ok(cartService.addToCart(auth.getName(), req.getProductId(), req.getQuantity() > 0 ? req.getQuantity() : 1));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartItemId, @RequestBody CartRequest req, Authentication auth) {
        try {
            return ResponseEntity.ok(cartService.updateQuantity(auth.getName(), cartItemId, req.getQuantity()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId, Authentication auth) {
        try {
            cartService.removeFromCart(auth.getName(), cartItemId);
            return ResponseEntity.ok(new ApiResponse(true, "Removed from cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication auth) {
        try {
            cartService.clearCart(auth.getName());
            return ResponseEntity.ok(new ApiResponse(true, "Cart cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
