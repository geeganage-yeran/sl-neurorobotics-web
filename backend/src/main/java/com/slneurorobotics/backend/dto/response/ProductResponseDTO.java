package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
    private int quantity;
    private List<ProductImageResponseDTO> images;
    private Map<String, String> specifications;
}