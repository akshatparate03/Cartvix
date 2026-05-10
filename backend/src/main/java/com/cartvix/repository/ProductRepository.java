package com.cartvix.repository;

import com.cartvix.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(p.category) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Product> searchProducts(@Param("q") String q);

    // FIX: Use nativeQuery=true to avoid Hibernate sending null params as bytea
    // which causes "function lower(bytea) does not exist" on PostgreSQL
    @Query(value = "SELECT * FROM products WHERE " +
            "(:category IS NULL OR LOWER(category) = LOWER(CAST(:category AS VARCHAR))) AND " +
            "(:minPrice IS NULL OR price >= CAST(:minPrice AS FLOAT8)) AND " +
            "(:maxPrice IS NULL OR price <= CAST(:maxPrice AS FLOAT8))", nativeQuery = true)
    List<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice);
}