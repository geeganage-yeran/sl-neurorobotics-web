package com.slneurorobotics.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OpenAIRequest {
    private String model;
    private List<Message> messages;
    private double temperature = 0.7;
    private int max_tokens = 500;

    @Data
    public static class Message {
        private String role;
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}