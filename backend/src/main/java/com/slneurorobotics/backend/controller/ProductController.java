package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.dto.response.HomePageDeviceResponseDTO;
import com.slneurorobotics.backend.dto.response.ProductResponseDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.service.HomePageService;
import com.slneurorobotics.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final HomePageService homePageService;

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

    @GetMapping("/getLatestProducts")
    public ResponseEntity<List<ProductResponseDTO>> getLatest4Products() {
        try {
            log.info("Fetching latest 4 products for footer");
            List<ProductResponseDTO> latestProducts = productService.getLatest4Products();
            log.info("Successfully fetched {} products", latestProducts.size());

            return ResponseEntity.ok(latestProducts);
        } catch (Exception e) {
            log.error("Error fetching latest products: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getHomePageDevice")
    public ResponseEntity<List<HomePageDeviceResponseDTO>> getHomePageDevice() {
        try {
            List<HomePageDeviceResponseDTO> devices = homePageService.getAllHomePageDevices();
            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Add this method to ProductController.java

    @GetMapping("/getLatestProduct")
    public ResponseEntity<ProductResponseDTO> getLatestProduct() {
        try {
            log.info("Fetching latest product for homepage");
            Optional<ProductResponseDTO> latestProduct = productService.getLatestProduct();

            if (latestProduct.isEmpty()) {
                log.warn("No enabled products found");
                return ResponseEntity.notFound().build();
            }

            log.info("Successfully fetched latest product: {}", latestProduct.get().getName());
            return ResponseEntity.ok(latestProduct.get());

        } catch (Exception e) {
            log.error("Error fetching latest product: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
