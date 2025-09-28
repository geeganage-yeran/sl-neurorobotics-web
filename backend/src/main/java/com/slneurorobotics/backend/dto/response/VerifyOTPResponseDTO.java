package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOTPResponseDTO {
    private boolean success;
    private String message;
    private boolean codeMatched;
    private boolean codeExpired;
    private String email;
    private LocalDateTime expirationTime;
}
