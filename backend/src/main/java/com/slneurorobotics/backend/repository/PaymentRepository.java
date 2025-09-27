package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by order ID
    Optional<Payment> findByOrderId(Long orderId);

    // Find payment by Stripe payment intent ID
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Find payments by status
    List<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status);

    // Find payments by user (through order relationship)
    @Query("SELECT p FROM Payment p JOIN p.order o WHERE o.userId = :userId ORDER BY p.createdAt DESC")
    List<Payment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Find successful payments by user
    @Query("SELECT p FROM Payment p JOIN p.order o WHERE o.userId = :userId AND p.status = 'SUCCEEDED' ORDER BY p.createdAt DESC")
    List<Payment> findSuccessfulPaymentsByUser(@Param("userId") Long userId);

    // Update payment status
    @Modifying
    @Query("UPDATE Payment p SET p.status = :status, p.updatedAt = :updatedAt WHERE p.paymentId = :paymentId")
    int updatePaymentStatus(@Param("paymentId") Long paymentId,
                            @Param("status") Payment.PaymentStatus status,
                            @Param("updatedAt") LocalDateTime updatedAt);

    // Update payment status by Stripe payment intent ID
    @Modifying
    @Query("UPDATE Payment p SET p.status = :status, p.updatedAt = :updatedAt WHERE p.stripePaymentIntentId = :paymentIntentId")
    int updatePaymentStatusByStripeId(@Param("paymentIntentId") String paymentIntentId,
                                      @Param("status") Payment.PaymentStatus status,
                                      @Param("updatedAt") LocalDateTime updatedAt);

    // Check if payment exists for order
    boolean existsByOrderId(Long orderId);

    // Check if Stripe payment intent already processed
    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);

    // Get total successful payments amount for user
    @Query("SELECT SUM(p.amount) FROM Payment p JOIN p.order o WHERE o.userId = :userId AND p.status = 'SUCCEEDED'")
    BigDecimal getTotalSuccessfulPaymentsByUser(@Param("userId") Long userId);

    // Count payments by status
    long countByStatus(Payment.PaymentStatus status);

    // Find recent payments (last 30 days)
    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :fromDate ORDER BY p.createdAt DESC")
    List<Payment> findRecentPayments(@Param("fromDate") LocalDateTime fromDate);
}