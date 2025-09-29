package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreeDModelResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String modelFilePath;
    private LocalDateTime createdAt;
}

