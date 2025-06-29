package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.ChatbotRequestDTO;
import com.slneurorobotics.backend.dto.request.ProductForChatbotDTO;
import com.slneurorobotics.backend.dto.request.PythonServiceRequestDTO;
import com.slneurorobotics.backend.dto.response.ChatbotResponseDTO;
import com.slneurorobotics.backend.dto.response.PythonServiceResponseDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final ProductRepository productRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    @Value("${python.service.chatbot.endpoint}")
    private String chatbotEndpoint;

    public ChatbotResponseDTO processQuestion(ChatbotRequestDTO request) {
        try {
            // Step 1: Get all enabled products from database
            List<Product> products = productRepository.findAllEnabledProductsForChatbot();
            log.info("Retrieved {} products from database", products.size());

            // Step 2: Convert products to DTO format for Python service
            List<ProductForChatbotDTO> productDTOs = products.stream()
                    .map(this::convertToProductForChatbotDTO)
                    .collect(Collectors.toList());

            // Step 3: Prepare request for Python service
            PythonServiceRequestDTO pythonRequest = new PythonServiceRequestDTO(
                    request.getQuestion(),
                    productDTOs
            );

            // Step 4: Call Python microservice
            PythonServiceResponseDTO pythonResponse = callPythonService(pythonRequest);

            // Step 5: Return response to frontend
            if (pythonResponse != null && "success".equals(pythonResponse.getStatus())) {
                return new ChatbotResponseDTO(pythonResponse.getResponse());
            } else {
                String errorMsg = pythonResponse != null ? pythonResponse.getError() : "Unknown error from Python service";
                log.error("Python service error: {}", errorMsg);
                return new ChatbotResponseDTO("I'm sorry, I'm having trouble processing your question right now. Please try again later.");
            }

        } catch (Exception e) {
            log.error("Error processing chatbot question: {}", e.getMessage(), e);
            return new ChatbotResponseDTO("I'm sorry, something went wrong. Please try again later.");
        }
    }

    private ProductForChatbotDTO convertToProductForChatbotDTO(Product product) {
        return new ProductForChatbotDTO(
                product.getName(),
                product.getDescription(),
                product.getSpecifications(),
                product.getOverview()
        );
    }

    private PythonServiceResponseDTO callPythonService(PythonServiceRequestDTO request) {
        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(pythonServiceUrl)
                    .build();

            Mono<PythonServiceResponseDTO> responseMono = webClient
                    .post()
                    .uri(chatbotEndpoint)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(PythonServiceResponseDTO.class)
                    .timeout(Duration.ofSeconds(30)); // 30 second timeout

            return responseMono.block(); // Convert to synchronous call

        } catch (WebClientResponseException e) {
            log.error("HTTP error calling Python service: Status {}, Body: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            return new PythonServiceResponseDTO(null, "error", "Service temporarily unavailable");
        } catch (Exception e) {
            log.error("Error calling Python service: {}", e.getMessage(), e);
            return new PythonServiceResponseDTO(null, "error", "Failed to connect to AI service");
        }
    }
}