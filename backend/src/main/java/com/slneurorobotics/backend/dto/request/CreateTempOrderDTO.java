package com.slneurorobotics.backend.dto.request;

import com.slneurorobotics.backend.entity.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTempOrderDTO {

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private Long userId;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Invalid amount format")
    private BigDecimal totalAmount;

    @NotNull(message = "Order source is required")
    private Order.OrderSource source;

    private String customerEmail;

    @Valid
    @NotEmpty(message = "Order items cannot be empty")
    @Size(max = 50, message = "Maximum 50 items allowed per order")
    private List<CreateOrderItemDTO> items;

    // Optional: Cart ID if coming from cart (for cleanup after payment)
    private Long cartId;

    // Shipping address ID (reference to user's address)
    @NotNull(message = "Shipping address is required")
    @Positive(message = "Shipping address ID must be positive")
    private Long shippingAddressId;

    // Optional: Applied discount info
    private String appliedPromoCode;

    @DecimalMin(value = "0.00", message = "Discount amount cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Invalid discount format")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    // Optional: Additional order notes
    @Size(max = 500, message = "Order notes cannot exceed 500 characters")
    private String orderNotes;

    // Nested DTO for order items
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateOrderItemDTO {

        @NotNull(message = "Product ID is required")
        @Positive(message = "Product ID must be positive")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 100, message = "Maximum quantity per item is 100")
        private Integer quantity;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Invalid price format")
        private BigDecimal price;
    }
}