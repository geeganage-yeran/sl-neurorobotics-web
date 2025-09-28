package com.slneurorobotics.backend.dto.response;

import com.slneurorobotics.backend.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
class PaymentResponseDTO {

    private Long paymentId;

    private String stripePaymentIntentId;

    private BigDecimal amount;

    private String status; // Using String instead of enum for frontend flexibility

    private String currency;

    private LocalDateTime createdAt;

    // Convenience method
    public boolean isSuccessful() {
        return "SUCCEEDED".equals(status);
    }
}