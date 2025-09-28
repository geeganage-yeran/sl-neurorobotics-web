package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.ThreeDModel;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.repository.ThreeDModelRepository;
import com.slneurorobotics.backend.service.TripoSRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/3d-models")
@RequiredArgsConstructor
@Slf4j
public class ThreeDModelController {

    private final TripoSRService tripoSRService;
    private final ProductRepository productRepository;
    private final ThreeDModelRepository threeDModelRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generate3DModel(
            @RequestParam("productId") Long productId,
            @RequestParam("image") MultipartFile image) {

        try {
            log.info("Received 3D model generation request for product: {}", productId);

            // Validate image
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Image file is required"
                ));
            }

            // Validate image type
            String contentType = image.getContentType();
            if (contentType == null || (!contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid file type. Please upload an image file."
                ));
            }

            // Find product
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

            // Generate 3D model using TripoSR
            String modelFilePath = tripoSRService.generateAndSave3DModel(image);

            // Save to database
            ThreeDModel threeDModel = new ThreeDModel();
            threeDModel.setProduct(product);
            threeDModel.setModelFilePath(modelFilePath);

            ThreeDModel savedModel = threeDModelRepository.save(threeDModel);

            // Return success response
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "3D model generated successfully",
                    "modelId", savedModel.getId(),
                    "modelPath", savedModel.getModelFilePath(),
                    "createdAt", savedModel.getCreatedAt()
            ));

        } catch (Exception e) {
            log.error("Error in 3D model generation", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getModelsByProductId(@PathVariable Long productId) {
        try {
            var models = threeDModelRepository.findByProductId(productId);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "models", models
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("3D Model API is working!");
    }
}