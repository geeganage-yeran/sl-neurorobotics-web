package com.slneurorobotics.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class productRequestDTO {
    private String name;
    private String summary;
    private String description;
    private String overview;
    private String tutorialLink;
    private BigDecimal price;

    @JsonProperty("enabled")
    private Boolean enabled = true;

    private List<Map<String, String>> specifications;
}
