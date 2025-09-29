package com.slneurorobotics.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long orderId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name= "shipping_id", nullable = false)
    private Long shippingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.TEMP;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private OrderSource source;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "paid_amount", precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "stripe_session_id")
    private String stripeSessionId;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Add tracking fields
    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "tracking_link")
    private String trackingLink;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    // Add shipping address relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_id", insertable = false, updatable = false)
    private Shipping_address shippingAddress;

    // Enums
    public enum OrderStatus {
        TEMP, PAID, CANCELLED, PROCESSING, SHIPPED, DELIVERED
    }

    public enum OrderSource {
        BUY_NOW, CART
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // Set expiration time for temp orders (30 minutes from creation)
        if (status == OrderStatus.TEMP) {
            expiresAt = LocalDateTime.now().plusMinutes(30);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}