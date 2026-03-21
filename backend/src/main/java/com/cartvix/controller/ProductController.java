package com.cartvix.controller;

import com.cartvix.dto.*;
import com.cartvix.model.Product;
import com.cartvix.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired private ProductService productService;

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

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest req, Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));
        try {
            return ResponseEntity.ok(productService.createProduct(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req, Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));
        try {
            return ResponseEntity.ok(productService.updateProduct(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication auth) {
        if (!ADMIN_EMAIL.equals(auth.getName()))
            return ResponseEntity.status(403).body(new ApiResponse(false, "Admin access required"));
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
