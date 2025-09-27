package com.slneurorobotics.backend.dto.response;

import com.slneurorobotics.backend.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {

    private Long orderId;

    private Long userId;

    // User details (fetched from User table)
    private String userEmail;

    private String userPhone;

    private BigDecimal totalAmount;

    private Order.OrderStatus status;

    private Order.OrderSource source;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Order items (fetched from OrderItem table)
    private List<OrderItemResponseDTO> items;

    // Payment information (if available)
    private PaymentResponseDTO payment;

    // Shipping address details (fetched from ShippingAddress table)
    private Long shippingAddressId;

    private ShippingAddressResponseDTO shippingAddress;

    // Order summary info
    private Integer totalItems;

    private BigDecimal subtotal;

    private BigDecimal discountAmount;

    private BigDecimal shippingCost;

    private BigDecimal taxAmount;

    // Optional fields that might be useful for frontend
    private String appliedPromoCode;

    private String orderNotes;

    // Stripe session ID (useful for tracking)
    private String stripeSessionId;

    // Tracking information
    private String trackingNumber;

    private String trackingLink;

    // Cancellation reason (if cancelled)
    private String cancellationReason;

    // Convenience methods for frontend
    public boolean isPaid() {
        return status == Order.OrderStatus.PAID;
    }

    public boolean isTemp() {
        return status == Order.OrderStatus.TEMP;
    }

    public boolean isCancelled() {
        return status == Order.OrderStatus.CANCELLED;
    }

    public boolean isShipped() {
        return status == Order.OrderStatus.DELIVERED;
    }

    public boolean isDelivered() {
        return status == Order.OrderStatus.DELIVERED;
    }

    public boolean isProcessing() {
        return status == Order.OrderStatus.PROCESSING;
    }

    public boolean isPending() {
        return status == Order.OrderStatus.PAID;
    }
}