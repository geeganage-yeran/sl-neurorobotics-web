package com.slneurorobotics.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CheckoutSessionRequest {
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Long amount;

    @NotNull(message = "Quantity is required")
    private int quantity;

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private String customerEmail;
}
