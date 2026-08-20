package com.cartvix.controller;

import com.cartvix.dto.*;
import com.cartvix.model.Product;
import com.cartvix.model.User;
import com.cartvix.repository.UserRepository;
import com.cartvix.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository;

    private static final String ADMIN_EMAIL = "akshatparate@gmail.com";

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(productService.getProducts(category, sort, minPrice, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProduct(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    // FEATURE: Seller dashboard — returns only the products the logged-in
    // seller has listed. Two path segments ("/seller/mine") on purpose so it
    // never collides with the "/api/products/{id}" permitAll pattern in
    // SecurityConfig — this endpoint always requires authentication.
    @GetMapping("/seller/mine")
    public ResponseEntity<?> getMyProducts(Authentication auth) {
        try {
            User user = currentUser(auth);
            if (!isAdmin(user) && !isSeller(user))
                return ResponseEntity.status(403).body(new ApiResponse(false, "Seller access required"));
            return ResponseEntity.ok(productService.getProductsBySeller(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest req, Authentication auth) {
        try {
            User user = currentUser(auth);
            if (!isAdmin(user) && !isSeller(user))
                return ResponseEntity.status(403).body(new ApiResponse(false, "Seller or admin access required"));
            // Admin-added products keep sellerId null (super-admin catalog);
            // seller-added products are stamped with that seller's id.
            Long sellerId = isAdmin(user) ? null : user.getId();
            return ResponseEntity.ok(productService.createProduct(req, sellerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req,
            Authentication auth) {
        try {
            User user = currentUser(auth);
            Product existing = productService.getProduct(id);
            if (!canManage(user, existing))
                return ResponseEntity.status(403).body(new ApiResponse(false, "You can only manage your own products"));
            return ResponseEntity.ok(productService.updateProduct(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication auth) {
        try {
            User user = currentUser(auth);
            Product existing = productService.getProduct(id);
            if (!canManage(user, existing))
                return ResponseEntity.status(403).body(new ApiResponse(false, "You can only manage your own products"));
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /*
     * ── Role / ownership helpers ────────────────────────────────────────
     * FEATURE: Sellers can add/edit/delete products just like the old
     * hardcoded admin used to — but only their OWN listings. The super-admin
     * (ADMIN_EMAIL) can still manage every product on the platform.
     */

    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private boolean isAdmin(User user) {
        return ADMIN_EMAIL.equals(user.getEmail());
    }

    private boolean isSeller(User user) {
        return "SELLER".equalsIgnoreCase(user.getRole());
    }

    private boolean canManage(User user, Product product) {
        if (isAdmin(user))
            return true;
        return isSeller(user)
                && product.getSellerId() != null
                && product.getSellerId().equals(user.getId());
    }
}