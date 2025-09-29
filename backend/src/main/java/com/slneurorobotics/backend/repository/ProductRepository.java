package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images i WHERE p.enabled = true ORDER BY p.id, i.displayOrder")
    List<Product> findAllWithImages();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images i WHERE p.enabled = true or p.enabled = false ORDER BY p.id, i.displayOrder")
    List<Product> findAllWithImagesAdmin();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images WHERE p.id = :id")
    Optional<Product> findByIdWithImages(@Param("id") Long id);


    @Query("SELECT p FROM Product p WHERE p.enabled = true")
    List<Product> findAllEnabledProductsForChatbot();

    @Query("SELECT p FROM Product p WHERE p.enabled = true ORDER BY p.createdAt DESC LIMIT 4")
    List<Product> findTop4EnabledProductsByCreatedAt();

    // Find products by name (for fuzzy matching)
    @Query("SELECT p FROM Product p WHERE p.enabled = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.summary) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Product> findBySearchTerm(@Param("searchTerm") String searchTerm);

    List<Product> findByEnabledTrue();

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p " +
            "WHERE p.enabled = true " +
            "ORDER BY p.createdAt DESC")
    List<Product> findLatestEnabledProduct();

}
