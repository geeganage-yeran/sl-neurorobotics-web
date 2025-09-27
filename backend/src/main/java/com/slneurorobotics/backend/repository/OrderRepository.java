package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by user ID
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find orders by user ID and status
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Order.OrderStatus status);

    // Find orders by status
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);

    // Find order by Stripe session ID
    Optional<Order> findByStripeSessionId(String stripeSessionId);

    // Find order by Stripe payment intent ID
    Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Find expired temp orders for cleanup
    @Query("SELECT o FROM Order o WHERE o.status = 'TEMP' AND o.expiresAt < :currentTime")
    List<Order> findExpiredTempOrders(@Param("currentTime") LocalDateTime currentTime);

    // Count temp orders by user (to limit concurrent temp orders if needed)
    long countByUserIdAndStatus(Long userId, Order.OrderStatus status);

    // Update order status
    @Modifying
    @Query("UPDATE Order o SET o.status = :status, o.updatedAt = :updatedAt WHERE o.orderId = :orderId")
    int updateOrderStatus(@Param("orderId") Long orderId,
                          @Param("status") Order.OrderStatus status,
                          @Param("updatedAt") LocalDateTime updatedAt);

    // Update order status and payment intent ID
    @Modifying
    @Query("UPDATE Order o SET o.status = :status, o.stripePaymentIntentId = :paymentIntentId, o.updatedAt = :updatedAt WHERE o.orderId = :orderId")
    int updateOrderStatusAndPaymentIntent(@Param("orderId") Long orderId,
                                          @Param("status") Order.OrderStatus status,
                                          @Param("paymentIntentId") String paymentIntentId,
                                          @Param("updatedAt") LocalDateTime updatedAt);

    // Mark expired temp orders as cancelled
    @Modifying
    @Query("UPDATE Order o SET o.status = 'CANCELLED', o.updatedAt = :updatedAt WHERE o.status = 'TEMP' AND o.expiresAt < :currentTime")
    int markExpiredOrdersAsCancelled(@Param("currentTime") LocalDateTime currentTime,
                                     @Param("updatedAt") LocalDateTime updatedAt);

    // Get user's order history (exclude temp orders)
    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.status != 'TEMP' ORDER BY o.createdAt DESC")
    List<Order> findUserOrderHistory(@Param("userId") Long userId);

    // Check if user has active temp order
    @Query("SELECT o FROM Order o WHERE o.userId = :userId AND o.status = 'TEMP' AND o.expiresAt > :currentTime")
    List<Order> findActiveTempOrders(@Param("userId") Long userId, @Param("currentTime") LocalDateTime currentTime);
}