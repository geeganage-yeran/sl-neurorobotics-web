package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.dto.response.ProductResponseDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class ProductController {

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

    @GetMapping(value = "/getProduct")
    public List<ProductResponseDTO> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        try {
            Optional<ProductResponseDTO> productDTO = productService.getProductById(id);

            if (productDTO.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(productDTO.get());

        } catch (Exception e) {
            log.error("Error fetching product with id: " + id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

}
