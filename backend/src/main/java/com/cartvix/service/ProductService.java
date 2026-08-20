package com.cartvix.service;

import com.cartvix.dto.ProductRequest;
import com.cartvix.model.Product;
import com.cartvix.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProducts(String category, String sort, Double minPrice, Double maxPrice) {
        List<Product> products;
        if (category != null && !category.isEmpty() && !category.equals("all")) {
            products = productRepository.filterProducts(category, minPrice, maxPrice);
        } else {
            products = productRepository.filterProducts(null, minPrice, maxPrice);
        }
        if ("price_asc".equals(sort))
            products.sort(Comparator.comparing(Product::getPrice));
        else if ("price_desc".equals(sort))
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        else
            products.sort(Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return products;
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> searchProducts(String q) {
        return productRepository.searchProducts(q);
    }

    // FEATURE: returns only the products listed by a specific seller,
    // used by the seller's "My Products" dashboard view.
    public List<Product> getProductsBySeller(Long sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        products.sort(Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return products;
    }

    // FEATURE: sellerId is now stamped on every new product so we know who
    // owns it. Pass null for the super-admin (keeps old admin behavior).
    public Product createProduct(ProductRequest req, Long sellerId) {
        Product p = Product.builder()
                .title(req.getTitle()).category(req.getCategory())
                .price(req.getPrice()).description(req.getDescription())
                .imageUrl(req.getImageUrl()).sellerId(sellerId).build();
        return productRepository.save(p);
    }

    public Product updateProduct(Long id, ProductRequest req) {
        Product p = getProduct(id);
        p.setTitle(req.getTitle());
        p.setCategory(req.getCategory());
        p.setPrice(req.getPrice());
        p.setDescription(req.getDescription());
        p.setImageUrl(req.getImageUrl());
        return productRepository.save(p);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}