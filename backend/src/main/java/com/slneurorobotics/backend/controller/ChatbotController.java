package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.ChatbotRequestDTO;
import com.slneurorobotics.backend.dto.response.ChatbotResponseDTO;
import com.slneurorobotics.backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<ChatbotResponseDTO> ask(@RequestBody ChatbotRequestDTO request) {
        try {
            // Validate input
            if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ChatbotResponseDTO("Please provide a valid question."));
            }

            // Process the question through our intelligent service
            String response = chatbotService.processUserQuestion(request.getQuestion());

            return ResponseEntity.ok(new ChatbotResponseDTO(response));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ChatbotResponseDTO("I'm sorry, I encountered an error. Please try again."));
        }
    }
}