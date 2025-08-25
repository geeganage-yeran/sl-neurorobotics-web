package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckoutSessionResponse {
    private String sessionId;
}
