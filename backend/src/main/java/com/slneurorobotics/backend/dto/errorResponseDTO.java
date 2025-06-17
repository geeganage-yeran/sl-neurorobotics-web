package com.slneurorobotics.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class errorResponseDTO {
    private boolean success;
    private String message;
    private Map<String, String> errors;
    private String errorType;

    // Constructor for success response
    public errorResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Constructor for error response with field errors
    public errorResponseDTO(boolean success, String message, Map<String, String> errors) {
        this.success = success;
        this.message = message;
        this.errors = errors;
    }
}
