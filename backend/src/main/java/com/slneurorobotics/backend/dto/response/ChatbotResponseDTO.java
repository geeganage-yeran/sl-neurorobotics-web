package com.slneurorobotics.backend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotResponseDTO {
    private String response;
    private String status;
    private Long timestamp;

    public ChatbotResponseDTO(String response) {
        this.response = response;
        this.status = "success";
        this.timestamp = System.currentTimeMillis();
    }
}