package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Find all items for a specific order
    List<OrderItem> findByOrderIdOrderByCreatedAt(Long orderId);

    // Find items by order ID with product details
    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.product WHERE oi.orderId = :orderId ORDER BY oi.createdAt")
    List<OrderItem> findByOrderIdWithProduct(@Param("orderId") Long orderId);

    // Delete all items for a specific order (useful for temp order cleanup)
    void deleteByOrderId(Long orderId);

    // Count items in an order
    long countByOrderId(Long orderId);

    // Calculate total amount for an order
    @Query("SELECT SUM(oi.price * oi.quantity) FROM OrderItem oi WHERE oi.orderId = :orderId")
    BigDecimal calculateOrderTotal(@Param("orderId") Long orderId);

    // Find orders containing a specific product
    @Query("SELECT DISTINCT oi.orderId FROM OrderItem oi WHERE oi.productId = :productId")
    List<Long> findOrderIdsByProductId(@Param("productId") Long productId);

    // Get total quantity of a product across all orders
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.productId = :productId")
    Long getTotalQuantityByProduct(@Param("productId") Long productId);

    // Find items by product ID (for inventory tracking)
    List<OrderItem> findByProductId(Long productId);

    // Check if order contains specific product
    boolean existsByOrderIdAndProductId(Long orderId, Long productId);
}