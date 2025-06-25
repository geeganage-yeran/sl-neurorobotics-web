package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String summary;
    private String description;
    private String overview;
    private String tutorialLink;
    private BigDecimal price;
    private Boolean enabled;
    private List<ProductImageResponseDTO> images;
    private String specifications; // JSON string
}