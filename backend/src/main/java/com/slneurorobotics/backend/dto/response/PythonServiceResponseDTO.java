package com.slneurorobotics.backend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PythonServiceResponseDTO {
    private String response;
    private String status;
    private String error;
}