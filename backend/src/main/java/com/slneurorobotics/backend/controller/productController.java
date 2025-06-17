package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.productRequestDTO;
import com.slneurorobotics.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
public class productController {

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
            productRequestDTO productRequest = objectMapper.readValue(productJson, productRequestDTO.class);
            productService.saveProduct(productRequest, images, imageNames, displayOrders);
            return ResponseEntity.ok("Product created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create Product: " + e.getMessage());
        }
    }
}
