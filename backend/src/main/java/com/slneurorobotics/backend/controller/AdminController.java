package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    @PostMapping("/addProduct")
    public ResponseEntity<?> createProduct(
            @RequestParam("product") String productJson,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam("imageNames") List<String> imageNames,
            @RequestParam("displayOrders") List<Integer> displayOrders
    ) {
        try {
            ProductRequestDTO productRequest = objectMapper.readValue(productJson, ProductRequestDTO.class);
            productService.saveProduct(productRequest, images, imageNames, displayOrders);
            return ResponseEntity.ok("Product created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create Product: " + e.getMessage());
        }
    }
}
