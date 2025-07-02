package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.repository.FaqRepository;
import com.slneurorobotics.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InternalController {

    @Value("${internal.api.key}")
    private String apiKey;

    private final FaqRepository faqRepository;
    private final ProductRepository productRepository;

    // Constructor
    public InternalController(FaqRepository faqRepository, ProductRepository productRepository) {
        this.faqRepository = faqRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/api/faq/all")
    public ResponseEntity<?> getAllFaqs(@RequestHeader(value = "API-Key", required = false) String providedKey) {
        if (!apiKey.equals(providedKey)) {
            return ResponseEntity.status(401).body("Invalid API Key");
        }
        List<FAQ> faqs = faqRepository.findAllQuestionsAndAnswers();
        return ResponseEntity.ok(faqs);
    }

    @GetMapping("/api/products/chatbot")
    public ResponseEntity<?> getProducts(@RequestHeader(value = "API-Key", required = false) String providedKey) {
        if (!apiKey.equals(providedKey)) {
            return ResponseEntity.status(401).body("Invalid API Key");
        }
        List<Product> products = productRepository.findAllEnabledProductsForChatbot();
        return ResponseEntity.ok(products);
    }
}