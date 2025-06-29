package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.ChatbotRequestDTO;
import com.slneurorobotics.backend.dto.response.ChatbotResponseDTO;
import com.slneurorobotics.backend.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<ChatbotResponseDTO> askQuestion(@Valid @RequestBody ChatbotRequestDTO request) {
        try {
            log.info("Received chatbot question: {}", request.getQuestion());

            ChatbotResponseDTO response = chatbotService.processQuestion(request);

            log.info("Chatbot response sent successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in chatbot controller: {}", e.getMessage(), e);
            ChatbotResponseDTO errorResponse = new ChatbotResponseDTO(
                    "I'm sorry, I encountered an error. Please try again later."
            );
            errorResponse.setStatus("error");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service is running");
    }
}