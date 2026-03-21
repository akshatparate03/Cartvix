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

    @Query("SELECT p FROM Product p WHERE (:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND (:minPrice IS NULL OR p.price >= :minPrice) AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> filterProducts(@Param("category") String category, @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}
