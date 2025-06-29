package com.slneurorobotics.backend.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductForChatbotDTO {
    private String name;
    private String description;
    private String specifications;
    private String overview;
}