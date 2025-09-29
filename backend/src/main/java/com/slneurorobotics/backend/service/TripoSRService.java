package com.slneurorobotics.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripoSRService {

    @Value("${triposr.api.key}")
    private String apiKey;

    @Value("${app.models.dir}")

    private String modelsDir;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();



    /**
     * Main method to generate a 3D model and save it locally
     */
    public String generateAndSave3DModel(MultipartFile imageFile) {
        try {
            log.info("Starting 3D model generation for: {}", imageFile.getOriginalFilename());

            // Validate API key
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new RuntimeException("Tripo3D API key is not configured");
            }

            // Validate file
            validateImageFile(imageFile);

            // Step 1: Create task in Tripo3D
            String taskId = createTaskWithTripo3D(imageFile);
            log.info("Task created with ID: {}", taskId);

            // Step 2: Wait until task is complete
            String modelUrl = waitForTaskCompletion(taskId);

            // Step 3: Download and save the model
            String savedPath = downloadAndSaveModel(modelUrl, taskId);

            log.info("3D model saved at: {}", savedPath);
            return savedPath;

        } catch (Exception e) {
            log.error("Error generating 3D model", e);
            throw new RuntimeException("Failed to generate 3D model: " + e.getMessage());
        }
    }

    /**
     * Validates the uploaded image file
     */
    private void validateImageFile(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new RuntimeException("Image file is required");
        }

        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }

        // Check supported formats
        String type = contentType.toLowerCase();
        if (!type.contains("jpeg") && !type.contains("jpg") &&
                !type.contains("png") && !type.contains("webp")) {
            throw new RuntimeException("Only JPEG, PNG, and WebP images are supported");
        }

        // Check file size (20MB max as per API docs)
        if (imageFile.getSize() > 20 * 1024 * 1024) {
            throw new RuntimeException("Image file too large. Maximum size is 20MB");
        }

        log.info("Image validation passed: {} ({} bytes, type: {})",
                imageFile.getOriginalFilename(), imageFile.getSize(), contentType);
    }


    /**
     * Uploads the image to Tripo3D using STS upload and returns an image_token
     */
    private String uploadFileToTripo3D(MultipartFile imageFile) throws IOException {
        String url = "https://api.tripo3d.ai/v2/openapi/upload/sts";

        log.info("Uploading image to Tripo3D: {}", imageFile.getOriginalFilename());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(apiKey);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(
                imageFile.getInputStream(),
                imageFile.getOriginalFilename(),
                imageFile.getSize()
        ));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            log.info("Upload API Response Status: {}", response.getStatusCode());
            log.info("Upload API Response Body: {}", response.getBody());

            JsonNode json = objectMapper.readTree(response.getBody());

            // Check if response has expected structure
            if (json.get("code") == null) {
                log.error("API response missing 'code' field. Full response: {}", json);
                throw new RuntimeException("Invalid API response structure");
            }

            int code = json.get("code").asInt();
            if (code != 0) {
                String message = json.has("message") ? json.get("message").asText() : "Unknown error";
                throw new RuntimeException("Upload failed (code " + code + "): " + message);
            }

            // Check if data and image_token exist
            JsonNode dataNode = json.get("data");
            if (dataNode == null || dataNode.get("image_token") == null) {
                log.error("API response missing expected data fields. Full response: {}", json);
                throw new RuntimeException("Invalid API response - missing image_token");
            }

            String imageToken = dataNode.get("image_token").asText();
            log.info("Image uploaded successfully, token: {}", imageToken);
            return imageToken;

        } catch (Exception e) {
            log.error("Error uploading image to Tripo3D", e);
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }


    /**
     * Creates a 3D model task using the uploaded image token
     */
    private String createTaskWithTripo3D(MultipartFile imageFile) throws IOException {
        // Step 1: Upload image to get image_token
        String imageToken = uploadFileToTripo3D(imageFile);

        // Step 2: Create task
        String url = "https://api.tripo3d.ai/v2/openapi/task";

        log.info("Creating 3D model task with image token: {}", imageToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // Extract file type from content type
        String fileType = "jpg"; // default
        String contentType = imageFile.getContentType();
        if (contentType != null) {
            if (contentType.contains("png")) fileType = "png";
            else if (contentType.contains("webp")) fileType = "webp";
            else if (contentType.contains("jpeg") || contentType.contains("jpg")) fileType = "jpg";
        }

        Map<String, Object> file = new HashMap<>();
        file.put("type", fileType);
        file.put("file_token", imageToken); // Use the image_token from STS upload

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("type", "image_to_model");
        requestBody.put("file", file);
        requestBody.put("model_version", "v2.5-20250123");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            log.info("Create Task API Response Status: {}", response.getStatusCode());
            log.info("Create Task API Response Body: {}", response.getBody());

            JsonNode json = objectMapper.readTree(response.getBody());

            // Check response structure
            if (json.get("code") == null) {
                log.error("API response missing 'code' field. Full response: {}", json);
                throw new RuntimeException("Invalid API response structure");
            }

            int code = json.get("code").asInt();
            if (code != 0) {
                String message = json.has("message") ? json.get("message").asText() : "Unknown error";
                throw new RuntimeException("Task creation failed (code " + code + "): " + message);
            }

            // Check if data and task_id exist
            JsonNode dataNode = json.get("data");
            if (dataNode == null || dataNode.get("task_id") == null) {
                log.error("API response missing expected data fields. Full response: {}", json);
                throw new RuntimeException("Invalid API response - missing task_id");
            }

            String taskId = dataNode.get("task_id").asText();
            log.info("Task created successfully with ID: {}", taskId);
            return taskId;

        } catch (Exception e) {
            log.error("Error creating task with Tripo3D", e);
            throw new IOException("Failed to create task: " + e.getMessage());
        }
    }


    /**
     * Polls Tripo3D until the task is complete
     */
    private String waitForTaskCompletion(String taskId) throws Exception {
        String url = "https://api.tripo3d.ai/v2/openapi/task/" + taskId;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        log.info("Starting to poll task completion for: {}", taskId);

        for (int i = 0; i < 60; i++) { // poll for 10 minutes max
            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                log.debug("Poll Task API Response (attempt {}): {}", i + 1, response.getBody());

                JsonNode json = objectMapper.readTree(response.getBody());

                // Check response structure
                JsonNode dataNode = json.get("data");
                if (dataNode == null) {
                    log.error("API response missing 'data' field. Full response: {}", json);
                    throw new RuntimeException("Invalid API response structure");
                }

                JsonNode statusNode = dataNode.get("status");
                if (statusNode == null) {
                    log.error("API response missing 'status' field. Full response: {}", json);
                    throw new RuntimeException("Invalid API response - missing status");
                }

                String status = statusNode.asText();
                log.info("Task {} status (attempt {}): {}", taskId, i + 1, status);

                if ("success".equalsIgnoreCase(status)) {
                    // Try different possible locations for the model URL based on API response structure
                    String modelUrl = null;

                    // First, try the new structure: data.result.pbr_model.url
                    JsonNode resultNode = dataNode.get("result");
                    if (resultNode != null && resultNode.get("pbr_model") != null && resultNode.get("pbr_model").get("url") != null) {
                        modelUrl = resultNode.get("pbr_model").get("url").asText();
                        log.info("Found model URL in result.pbr_model.url: {}", modelUrl);
                    }
                    // Fallback to legacy structure: data.model_mesh.url
                    else if (dataNode.get("model_mesh") != null && dataNode.get("model_mesh").get("url") != null) {
                        modelUrl = dataNode.get("model_mesh").get("url").asText();
                        log.info("Found model URL in model_mesh.url: {}", modelUrl);
                    }
                    // Try another location: data.output.pbr_model
                    else if (dataNode.get("output") != null && dataNode.get("output").get("pbr_model") != null) {
                        modelUrl = dataNode.get("output").get("pbr_model").asText();
                        log.info("Found model URL in output.pbr_model: {}", modelUrl);
                    }

                    if (modelUrl == null || modelUrl.trim().isEmpty()) {
                        log.error("API response missing model URL. Full response: {}", json);
                        throw new RuntimeException("Invalid API response - missing model URL");
                    }

                    log.info("Task completed successfully, model URL: {}", modelUrl);
                    return modelUrl;

                } else if ("failed".equalsIgnoreCase(status)) {
                    String errorMsg = "Task failed";
                    JsonNode messageNode = dataNode.get("message");
                    if (messageNode != null) {
                        errorMsg += ": " + messageNode.asText();
                    }
                    throw new RuntimeException(errorMsg);
                } else if ("running".equalsIgnoreCase(status) || "queued".equalsIgnoreCase(status)) {
                    // Task is still processing, continue polling
                    Thread.sleep(10000); // wait 10s before next poll
                } else {
                    log.warn("Unknown task status: {}", status);
                    Thread.sleep(10000); // wait and try again
                }

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Task polling interrupted");
            } catch (Exception e) {
                log.error("Error polling task status (attempt {}): {}", i + 1, e.getMessage());
                if (i == 59) { // last attempt
                    throw e;
                }
                Thread.sleep(10000); // wait before retry
            }
        }

        throw new RuntimeException("Task timeout - model generation took too long");
    }


    /**
     * Downloads the 3D model and saves it locally
     */
    private String downloadAndSaveModel(String modelUrl, String taskId) throws IOException {
        log.info("Downloading 3D model from: {}", modelUrl);

        File directory = new File(modelsDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("Failed to create models directory: " + modelsDir);
            }
        }

        String filename = "model_" + taskId + "_" + System.currentTimeMillis() + ".glb";
        String filePath = modelsDir + File.separator + filename;

        try (InputStream in = new URL(modelUrl).openStream();
             FileOutputStream out = new FileOutputStream(filePath)) {

            long bytesTransferred = in.transferTo(out);
            log.info("Model downloaded successfully: {} ({} bytes)", filePath, bytesTransferred);

            return filePath;
        } catch (Exception e) {
            log.error("Error downloading model", e);
            throw new IOException("Failed to download model: " + e.getMessage());
        }
    }

//    /**
//     * Test API connectivity and balance
//     */
//    public void testTripoAPIConnection() {
//        try {
//            String url = "https://api.tripo3d.ai/v2/openapi/user/balance";
//            HttpHeaders headers = new HttpHeaders();
//            headers.setBearerAuth(apiKey);
//            HttpEntity<Void> entity = new HttpEntity<>(headers);
//
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
//            log.info("API Test Response: {}", response.getBody());
//        } catch (Exception e) {
//            log.error("API connectivity test failed", e);
//        }
//    }


    /**
     * Helper class to send MultipartFile as Resource
     */
    static class MultipartInputStreamFileResource extends InputStreamResource {
        private final String filename;
        private final long contentLength;

        MultipartInputStreamFileResource(InputStream inputStream, String filename, long contentLength) {
            super(inputStream);
            this.filename = filename;
            this.contentLength = contentLength;
        }

        @Override
        public String getFilename() {
            return this.filename;
        }

        @Override
        public long contentLength() {
            return this.contentLength;
        }
    }
}