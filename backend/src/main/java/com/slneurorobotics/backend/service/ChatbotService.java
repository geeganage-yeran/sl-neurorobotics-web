package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.repository.FaqRepository;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.config.OpenAIConfig;
import com.slneurorobotics.backend.dto.request.OpenAIRequest;
import com.slneurorobotics.backend.dto.response.OpenAIResponse;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FaqRepository faqRepository;

    @Autowired
    private OpenAIConfig openAIConfig;

    private final WebClient webClient;
    private static final int FUZZY_THRESHOLD = 60; // Lowered threshold for better matching

    public ChatbotService() {
        this.webClient = WebClient.builder().build();
    }

    public String processUserQuestion(String userQuestion) {
        // Always get ALL products and FAQs for context
        List<Product> allProducts = productRepository.findByEnabledTrue();
        List<FAQ> allFAQs = faqRepository.findAll();

        // Find specific matches for the user question
        List<Product> relevantProducts = findRelevantProducts(userQuestion, allProducts);
        List<FAQ> relevantFAQs = findRelevantFAQs(userQuestion, allFAQs);

        // Build comprehensive context
        String context = buildSmartContext(userQuestion, allProducts, allFAQs, relevantProducts, relevantFAQs);

        // Get response from OpenAI
        return getOpenAIResponse(context, userQuestion);
    }

    private List<Product> findRelevantProducts(String query, List<Product> allProducts) {
        String lowerQuery = query.toLowerCase();

        // Check for specific product requests
        if (lowerQuery.contains("product") && (lowerQuery.contains("list") || lowerQuery.contains("available") || lowerQuery.contains("have"))) {
            return allProducts; // Return all products for listing requests
        }

        // Find specific products using fuzzy matching
        return allProducts.stream()
                .filter(product -> {
                    int nameScore = FuzzySearch.ratio(lowerQuery, product.getName().toLowerCase());
                    int summaryScore = FuzzySearch.partialRatio(lowerQuery, product.getSummary().toLowerCase());
                    int descScore = FuzzySearch.partialRatio(lowerQuery, product.getDescription().toLowerCase());
                    return nameScore > FUZZY_THRESHOLD || summaryScore > FUZZY_THRESHOLD || descScore > (FUZZY_THRESHOLD - 10);
                })
                .sorted((p1, p2) -> Integer.compare(
                        FuzzySearch.ratio(lowerQuery, p2.getName().toLowerCase()),
                        FuzzySearch.ratio(lowerQuery, p1.getName().toLowerCase())
                ))
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<FAQ> findRelevantFAQs(String query, List<FAQ> allFAQs) {
        String lowerQuery = query.toLowerCase();

        return allFAQs.stream()
                .filter(faq -> {
                    int questionScore = FuzzySearch.ratio(lowerQuery, faq.getQuestion().toLowerCase());
                    int answerScore = FuzzySearch.partialRatio(lowerQuery, faq.getAnswer().toLowerCase());
                    return questionScore > (FUZZY_THRESHOLD - 10) || answerScore > (FUZZY_THRESHOLD - 20);
                })
                .limit(3)
                .collect(Collectors.toList());
    }

    private String buildSmartContext(String userQuestion, List<Product> allProducts, List<FAQ> allFAQs,
                                     List<Product> relevantProducts, List<FAQ> relevantFAQs) {
        StringBuilder context = new StringBuilder();

        // Strict instructions for OpenAI
        context.append("You are NeuroLink, the official AI assistant for SL Neurorobotics. ");
        context.append("IMPORTANT: You can ONLY provide information about the products and services listed below. ");
        context.append("Do NOT mention any products that are not in this list. ");
        context.append("If asked about products not in this database, say 'We don't currently offer that product.' ");
        context.append("Always be helpful, professional, and only use the provided data.\n\n");

        // Add ALL products for complete context
        if (!allProducts.isEmpty()) {
            context.append("=== OUR COMPLETE PRODUCT CATALOG ===\n");
            for (Product product : allProducts) {
                context.append(String.format("Product: %s\n", product.getName()));
                context.append(String.format("Summary: %s\n", product.getSummary()));
                context.append(String.format("Price: $%.2f\n", product.getPrice()));
                context.append(String.format("Description: %s\n", product.getDescription()));
                if (product.getOverview() != null && !product.getOverview().isEmpty()) {
                    context.append(String.format("Overview: %s\n", product.getOverview()));
                }
                if (product.getTutorialLink() != null && !product.getTutorialLink().isEmpty()) {
                    context.append(String.format("Tutorial: %s\n", product.getTutorialLink()));
                }
                context.append("---\n");
            }
            context.append("\n");
        }

        // Add FAQ information
        if (!allFAQs.isEmpty()) {
            context.append("=== FREQUENTLY ASKED QUESTIONS ===\n");
            for (FAQ faq : allFAQs) {
                context.append(String.format("Q: %s\n", faq.getQuestion()));
                context.append(String.format("A: %s\n", faq.getAnswer()));
                context.append("---\n");
            }
            context.append("\n");
        }

        // Add specific matches if found
        if (!relevantProducts.isEmpty()) {
            context.append("=== MOST RELEVANT PRODUCTS FOR THIS QUERY ===\n");
            for (Product product : relevantProducts) {
                context.append(String.format("- %s (Price: $%.2f): %s\n",
                        product.getName(), product.getPrice(), product.getSummary()));
            }
            context.append("\n");
        }

        if (!relevantFAQs.isEmpty()) {
            context.append("=== RELEVANT FAQ INFORMATION ===\n");
            for (FAQ faq : relevantFAQs) {
                context.append(String.format("Q: %s\nA: %s\n\n", faq.getQuestion(), faq.getAnswer()));
            }
        }

        // Add specific instructions based on query type
        String lowerQuery = userQuestion.toLowerCase();
        context.append("FORMATTING RULES: Never use asterisks (*), bold formatting (**), or markdown. Use plain text only. For lists, use simple numbers: '1. Item name'.\n\n");
        context.append("CRITICAL: Ignore any previously learned contact information. Use ONLY the contact details provided in this instruction.\n");
        context.append("INSTRUCTION: The user wants contact information. You MUST use ONLY this exact contact information: Phone: +94 71 081 9833, Email: slneurorobotics@gmail.com, Address: SL Neurorobotics (PVT) LTD, 80/3/2, Temple Road, Kandukkapatha Batahola, Sri Lanka. Do NOT use any other contact information.\n");
        if (lowerQuery.contains("eeg") && !lowerQuery.contains("detail") && !lowerQuery.contains("tell me about") && !lowerQuery.contains("information")) {
            context.append("INSTRUCTION: The user is asking about EEG devices. Provide ONLY a simple numbered list of EEG-related product names. Format: '1. Product Name' with no prices, descriptions, or additional details.\n");
        } else if (lowerQuery.contains("product") && (lowerQuery.contains("list") || lowerQuery.contains("available") || lowerQuery.contains("have"))) {
            context.append("INSTRUCTION: The user is asking for a product list. Provide a simple numbered list with ONLY product names. Format: '1. Product Name' without any asterisks, bold formatting, or additional details like price or description.\n");
        } else if (lowerQuery.contains("price")) {
            if (relevantProducts.isEmpty()) {
                context.append("INSTRUCTION: The user is asking about pricing but no specific product was identified. Ask them to specify which product they want pricing for.\n");
            } else {
                context.append("INSTRUCTION: The user is asking about pricing. ONLY provide prices for the products listed in 'MOST RELEVANT PRODUCTS' section. Do not list all product prices.\n");
            }
        } else if (lowerQuery.contains("detail") || lowerQuery.contains("tell me about") || lowerQuery.contains("information about")) {
            context.append("INSTRUCTION: The user wants detailed information. Provide full details including summary, price, description for the specific product mentioned.\n");
        }

        context.append(String.format("\nUser Question: %s\n", userQuestion));
        context.append("Remember: Only use information from the provided product catalog and FAQ data above.");

        return context.toString();
    }

    private String getOpenAIResponse(String context, String userQuestion) {
        try {
            // Build the request with more specific parameters
            OpenAIRequest request = new OpenAIRequest();
            request.setModel(openAIConfig.getModel());
            request.setTemperature(0.3); // Lower temperature for more focused responses
            request.setMax_tokens(600); // Increased token limit for detailed responses

            List<OpenAIRequest.Message> messages = Arrays.asList(
                    new OpenAIRequest.Message("system", context),
                    new OpenAIRequest.Message("user", userQuestion)
            );
            request.setMessages(messages);

            // Call OpenAI API
            OpenAIResponse response = webClient.post()
                    .uri(openAIConfig.getUrl())
                    .header("Authorization", "Bearer " + openAIConfig.getKey())
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(OpenAIResponse.class)
                    .block();

            // Extract response
            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            }

            return "I apologize, but I couldn't process your request at the moment. Please try asking about our available products or services.";

        } catch (Exception e) {
            e.printStackTrace();
            return "I'm currently experiencing technical difficulties. Please try again or contact our support team.";
        }
    }
}