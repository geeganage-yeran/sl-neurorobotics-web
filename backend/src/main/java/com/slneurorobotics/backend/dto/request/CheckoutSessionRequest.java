package com.slneurorobotics.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CheckoutSessionRequest {
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Long amount; // Amount in cents

    @NotNull(message = "Order ID is required")
    private Long orderId; // Links to your order - ESSENTIAL

    private String customerEmail; // Recommended for better UX
}
