package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponseDTO {
    private Long id;
    private String imageUrl;
    private String imageName;
    private Integer displayOrder;
}