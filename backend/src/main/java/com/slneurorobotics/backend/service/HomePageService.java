package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.HomePageDeviceDTO;
import com.slneurorobotics.backend.dto.response.HomePageDeviceResponseDTO;
import com.slneurorobotics.backend.entity.HomePageDevice;
import com.slneurorobotics.backend.repository.HomePageDeviceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class HomePageService {

    private final HomePageDeviceRepository homePageDeviceRepository;

    @Value("${product.image.upload.dir2}")
    private String uploadDir;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            log.info("Upload directory created/verified at: {}", uploadPath.toAbsolutePath());
        } catch (IOException e) {
            log.error("Could not create upload directory: {}", uploadDir, e);
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Transactional
    public void saveDeviceSection(HomePageDeviceDTO deviceData, MultipartFile deviceImage) {
        try {
            // Get existing device section or create new one
            HomePageDevice device = homePageDeviceRepository.findFirstByOrderByUpdatedAtDesc()
                    .orElse(new HomePageDevice());

            // Update basic information
            device.setTitle(deviceData.getTitle());
            device.setDescription(deviceData.getDescription());

            // Handle image upload if provided
            if (deviceImage != null && !deviceImage.isEmpty()) {
                log.info("Processing image upload: {}", deviceImage.getOriginalFilename());
                String imageUrl = saveImage(deviceImage);
                device.setImageUrl(imageUrl);
                log.info("Image saved with URL: {}", imageUrl);
            }

            HomePageDevice savedDevice = homePageDeviceRepository.save(device);
            log.info("Device section saved with ID: {}", savedDevice.getId());

        } catch (Exception e) {
            log.error("Error saving device section: ", e);
            throw new RuntimeException("Failed to save device section", e);
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Invalid file type. Only images are allowed.");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = "device_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 8) + "." + fileExtension;

        // Create full path
        Path filePath = Paths.get(uploadDir, uniqueFilename);

        log.info("Saving file to: {}", filePath.toAbsolutePath());

        // Save file
        Files.write(filePath, file.getBytes());

        // Verify file was saved
        if (!Files.exists(filePath)) {
            throw new IOException("File was not saved successfully");
        }

        // Return URL - make sure this matches your static resource configuration
        String imageUrl = baseUrl + "/uploads/" + uniqueFilename;
        log.info("Generated image URL: {}", imageUrl);

        return imageUrl;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "jpg";
        }
        int lastDotIndex = filename.lastIndexOf(".");
        return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1).toLowerCase() : "jpg";
    }

    @Transactional(readOnly = true)
    public List<HomePageDeviceResponseDTO> getAllHomePageDevices() {
        List<HomePageDevice> devices = homePageDeviceRepository.findAllByOrderByUpdatedAtDesc();

        log.info("Found {} devices", devices.size());

        List<HomePageDeviceResponseDTO> result = devices.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Log each device for debugging
        result.forEach(device -> {
            log.info("Device: Title={}, ImageURL={}", device.getTitle(), device.getImageUrl());
        });

        return result;
    }

    private HomePageDeviceResponseDTO convertToDTO(HomePageDevice device) {
        return new HomePageDeviceResponseDTO(
                device.getTitle(),
                device.getDescription(),
                device.getImageUrl(),
                device.getUpdatedAt()
        );

    }
}