package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.EmailRequestDTO;
import com.slneurorobotics.backend.service.EmailSenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
@Slf4j
public class EmailSenderController {

    private final EmailSenderService emailSenderService;

    @PostMapping("/sendemail")
    public ResponseEntity<?> sendInquiryEmail(@RequestBody EmailRequestDTO request) {
        try {
            emailSenderService.sendEmail(request);
            log.info("Email sent successfully to: {}", request.getEmail());
            return ResponseEntity.ok("Email sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send email: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
}