package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.response.ThreeDModelResponseDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.ThreeDModel;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.repository.ThreeDModelRepository;
import com.slneurorobotics.backend.service.TripoSRService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/3d-models")
@RequiredArgsConstructor
@Slf4j
public class ThreeDModelController {

    private final TripoSRService tripoSRService;
    private final ProductRepository productRepository;
    private final ThreeDModelRepository threeDModelRepository;

    @Value("${app.models.dir}")
    private String modelsDir;

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
            List<ThreeDModel> models = threeDModelRepository.findByProductId(productId);

            List<ThreeDModelResponseDTO> modelDTOs = models.stream()
                    .map(model -> new ThreeDModelResponseDTO(
                            model.getId(),
                            model.getProduct().getId(),
                            model.getProduct().getName(),
                            model.getModelFilePath(),
                            model.getCreatedAt()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "models", modelDTOs
            ));
        } catch (Exception e) {
            log.error("Error fetching 3D models for product: {}", productId, e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllModels() {
        try {
            List<ThreeDModel> models = threeDModelRepository.findAll();

            List<ThreeDModelResponseDTO> modelDTOs = models.stream()
                    .map(model -> new ThreeDModelResponseDTO(
                            model.getId(),
                            model.getProduct().getId(),
                            model.getProduct().getName(),
                            model.getModelFilePath(),
                            model.getCreatedAt()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "models", modelDTOs
            ));
        } catch (Exception e) {
            log.error("Error fetching 3D models", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{modelId}")
    public ResponseEntity<?> deleteModel(@PathVariable Long modelId) {
        try {
            ThreeDModel model = threeDModelRepository.findById(modelId)
                    .orElseThrow(() -> new RuntimeException("3D Model not found with ID: " + modelId));

            threeDModelRepository.delete(model);

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "3D model deleted successfully"
            ));
        } catch (Exception e) {
            log.error("Error deleting 3D model", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getModelFile(@PathVariable String filename) {
        try {
            log.info("Serving model file: {}", filename);

            // Security: Validate filename to prevent path traversal attacks
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                log.warn("Potential path traversal attempt with filename: {}", filename);
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(modelsDir).resolve(filename).normalize();
            log.info("Full file path: {}", filePath.toString());

            UrlResource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                log.info("File found and readable: {}", filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("model/gltf-binary"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600") // Add caching
                        .body(resource); // ✅ Remove unnecessary cast
            } else {
                log.warn("File not found or not readable: {}", filePath.toString());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error serving model file: {}", filename, e);
            return ResponseEntity.status(500).build();
        }
    }

}