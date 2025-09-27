package com.slneurorobotics.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.dto.response.ProductImageResponseDTO;
import com.slneurorobotics.backend.dto.response.ProductResponseDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.Product_image;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.repository.ProductImageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Value("${product.image.upload.dir}")
    private String productImageUploadDir;

    @Value("${Product.details.json.file:products_details.json}")
    private String productDetailsJsonFile;

    @Value("${server.base-url:http://localhost:8080}")
    private String serverBaseUrl;

    @Transactional
    public void saveProduct(ProductRequestDTO productRequest, List<MultipartFile> images, List<String> imageNames, List<Integer> displayOrders) {
        // 1. Save Product data
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setSummary(productRequest.getSummary());
        product.setDescription(productRequest.getDescription());
        product.setOverview(productRequest.getOverview());
        product.setTutorialLink(productRequest.getTutorialLink());
        product.setPrice(productRequest.getPrice());
        product.setEnabled(productRequest.getEnabled());

        //specification saving
        if (productRequest.getSpecifications() != null && !productRequest.getSpecifications().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String specificationsJson = mapper.writeValueAsString(productRequest.getSpecifications());
                product.setSpecifications(specificationsJson);
            } catch (Exception e) {
                throw new RuntimeException("Error processing specifications: " + e.getMessage(), e);
            }
        }
        productRepository.save(product);

        if (product.getId() != null) {
            appendProductDetailsToJson(product, productRequest);
        }

        // saving images
        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                try {
                    MultipartFile imageFile = images.get(i);
                    String imageName = imageNames.get(i);
                    Integer displayOrder = displayOrders.get(i);

                    // Create the Product directory if it doesn't exist
                    String productDir = productImageUploadDir + File.separator + product.getId();
                    File dir = new File(productDir);
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }

                    // Save image to the file system
                    String imagePath = productDir + File.separator + imageName;
                    imageFile.transferTo(new File(imagePath));

                    // 4. Create ProductImage entity and link it to the Product
                    Product_image productImage = new Product_image();
                    productImage.setProduct(product);
                    productImage.setImageName(imageName);
                    productImage.setImageUrl(imagePath);  // Save the path to the image
                    productImage.setDisplayOrder(displayOrder);

                    productImageRepository.save(productImage);  // Save image record to DB

                } catch (IOException e) {
                    throw new RuntimeException("Error while saving image: " + e.getMessage(), e);
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        List<Product> productList = productRepository.findAllWithImages();

        return productList.stream()
                .filter(Product::getEnabled)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProductsForAdmin() {
        List<Product> productList = productRepository.findAllWithImagesAdmin();

        return productList.stream()
                .map(this::convertToResponseDTOForAdmin)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponseDTO> getProductByIdForAdmin(Long id) {
        Optional<Product> productOptional = productRepository.findByIdWithImages(id);

        if (productOptional.isEmpty()) {
            return Optional.empty();
        }

        Product product = productOptional.get();
        return Optional.of(convertToResponseDTOForAdmin(product));
    }

    @Transactional
    public void updateProduct(Long id, ProductRequestDTO productRequest,
                              List<MultipartFile> images,
                              List<String> imageNames,
                              List<Integer> displayOrders,
                              boolean keepExistingImages,
                              List<Long> removedImageIds) throws Exception {

        Optional<Product> existingProductOpt = productRepository.findByIdWithImages(id);
        if (existingProductOpt.isEmpty()) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }

        Product existingProduct = existingProductOpt.get();

        // Update basic product details
        existingProduct.setName(productRequest.getName());
        existingProduct.setSummary(productRequest.getSummary());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setOverview(productRequest.getOverview());
        existingProduct.setTutorialLink(productRequest.getTutorialLink());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setEnabled(productRequest.getEnabled());

        // Update specifications
        if (productRequest.getSpecifications() != null && !productRequest.getSpecifications().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String specificationsJson = mapper.writeValueAsString(productRequest.getSpecifications());
                existingProduct.setSpecifications(specificationsJson);
            } catch (Exception e) {
                throw new RuntimeException("Error processing specifications: " + e.getMessage(), e);
            }
        } else {
            existingProduct.setSpecifications(null);
        }

        // Handle specific image removals
        if (removedImageIds != null && !removedImageIds.isEmpty()) {
            List<Product_image> imagesToRemove = existingProduct.getImages().stream()
                    .filter(img -> removedImageIds.contains(img.getId()))
                    .collect(Collectors.toList());

            for (Product_image image : imagesToRemove) {
                deleteImageFile(existingProduct.getId(), image.getImageName());
                existingProduct.getImages().remove(image);
                productImageRepository.delete(image);
            }
        }

        // Handle complete image replacement
        if (!keepExistingImages && (removedImageIds == null || removedImageIds.isEmpty())) {
            List<Product_image> existingImages = new ArrayList<>(existingProduct.getImages());
            for (Product_image image : existingImages) {
                deleteImageFile(existingProduct.getId(), image.getImageName());
                productImageRepository.delete(image);
            }
            existingProduct.getImages().clear();
        }

        // Add new images if provided
        if (images != null && !images.isEmpty()) {
            saveProductImages(existingProduct, images, imageNames, displayOrders);
        }

        productRepository.save(existingProduct);
        updateProductDetailsInJson(existingProduct, productRequest);
    }

    @Transactional
    public void deleteProduct(Long id) throws Exception {
        Optional<Product> productOpt = productRepository.findByIdWithImages(id);
        if (productOpt.isEmpty()) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }

        Product product = productOpt.get();

        // Delete all associated images from filesystem
        for (Product_image image : product.getImages()) {
            deleteImageFile(product.getId(), image.getImageName());
        }

        // Delete the product (cascading will handle image records)
        productRepository.delete(product);

        // Clean up empty directory
        try {
            Path productDir = Paths.get(productImageUploadDir).resolve(id.toString());
            if (Files.exists(productDir) && Files.isDirectory(productDir)) {
                Files.delete(productDir);
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not delete product directory: " + e.getMessage());
        }

        // Remove from JSON file
        removeProductFromJson(id);
    }

    private ProductResponseDTO convertToResponseDTOForAdmin(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSummary(product.getSummary());
        dto.setDescription(product.getDescription());
        dto.setOverview(product.getOverview());
        dto.setTutorialLink(product.getTutorialLink());
        dto.setPrice(product.getPrice());
        dto.setEnabled(product.getEnabled());

        // Use the same specifications parsing logic
        Map<String, String> specifications = parseSpecifications(product.getSpecifications());
        dto.setSpecifications(specifications);

        // Convert images with proper URLs
        List<ProductImageResponseDTO> imageDTOs = product.getImages().stream()
                .map(this::convertToImageResponseDTOWithUrl)
                .sorted(Comparator.comparing(ProductImageResponseDTO::getDisplayOrder))
                .collect(Collectors.toList());

        dto.setImages(imageDTOs);
        return dto;
    }

    private ProductImageResponseDTO convertToImageResponseDTOWithUrl(Product_image image) {
        ProductImageResponseDTO dto = new ProductImageResponseDTO();
        dto.setId(image.getId());
        dto.setImageName(image.getImageName());
        dto.setDisplayOrder(image.getDisplayOrder());

        // Construct the full URL for the image
        String imageUrl = serverBaseUrl + "/uploads/productImages/" +
                image.getProduct().getId() + "/" + image.getImageName();
        dto.setImageUrl(imageUrl);

        return dto;
    }

    private void deleteImageFile(Long productId, String imageName) {
        try {
            Path filePath = Paths.get(productImageUploadDir)
                    .resolve(productId.toString())
                    .resolve(imageName);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            System.err.println("Warning: Could not delete image file: " + imageName + " - " + e.getMessage());
        }
    }

    private void saveProductImages(Product product, List<MultipartFile> images,
                                   List<String> imageNames, List<Integer> displayOrders) throws Exception {
        if (images == null || images.isEmpty()) return;

        // Create product directory
        String productDir = productImageUploadDir + File.separator + product.getId();
        File dir = new File(productDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        for (int i = 0; i < images.size(); i++) {
            MultipartFile imageFile = images.get(i);
            String imageName = (imageNames != null && i < imageNames.size()) ?
                    imageNames.get(i) : imageFile.getOriginalFilename();
            Integer displayOrder = (displayOrders != null && i < displayOrders.size()) ?
                    displayOrders.get(i) : i + 1;

            // Save the file with timestamp to avoid conflicts
            String filename = System.currentTimeMillis() + "_" + imageName;
            String imagePath = productDir + File.separator + filename;
            imageFile.transferTo(new File(imagePath));

            // Create image entity
            Product_image productImage = new Product_image();
            productImage.setProduct(product);
            productImage.setImageName(filename);
            productImage.setImageUrl(imagePath);
            productImage.setDisplayOrder(displayOrder);

            product.getImages().add(productImage);
        }
    }
/// /
    private ProductResponseDTO convertToResponseDTO(Product product) {
    ProductResponseDTO dto = new ProductResponseDTO();
    dto.setId(product.getId());
    dto.setName(product.getName());
    dto.setSummary(product.getSummary());
    dto.setDescription(product.getDescription());
    dto.setOverview(product.getOverview());
    dto.setTutorialLink(product.getTutorialLink());
    dto.setPrice(product.getPrice());
    dto.setEnabled(product.getEnabled());

    // Use the same specifications parsing logic as admin version
    Map<String, String> specifications = parseSpecifications(product.getSpecifications());
    dto.setSpecifications(specifications);

    List<ProductImageResponseDTO> imageDTOs = product.getImages().stream()
            .map(this::convertToImageResponseDTO)
            .sorted(Comparator.comparing(ProductImageResponseDTO::getDisplayOrder))
            .collect(Collectors.toList());

    dto.setImages(imageDTOs);
    return dto;
}

    private Map<String, String> parseSpecifications(String specificationsJson) {
        if (specificationsJson == null || specificationsJson.trim().isEmpty()) {
            return Map.of();
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(specificationsJson);
            Map<String, String> specifications = new LinkedHashMap<>();

            if (rootNode.isArray()) {
                // Handle array format like yours
                for (JsonNode item : rootNode) {
                    if (item.isObject()) {
                        // Check for your specific format: name + description
                        if (item.has("name")) {
                            String name = item.get("name").asText();
                            String value = "";

                            // Use description as value if available
                            if (item.has("description")) {
                                value = item.get("description").asText();
                            }
                            // Fallback to value field
                            else if (item.has("value")) {
                                value = item.get("value").asText();
                            }

                            specifications.put(name, value);
                        }
                        // Handle other possible formats
                        else if (item.has("key") && item.has("value")) {
                            specifications.put(
                                    item.get("key").asText(),
                                    item.get("value").asText()
                            );
                        }
                        else {
                            // Handle flat key-value objects in array
                            item.fields().forEachRemaining(entry -> {
                                if (!"id".equals(entry.getKey())) { // Skip id field
                                    specifications.put(entry.getKey(), entry.getValue().asText());
                                }
                            });
                        }
                    }
                }
            } else if (rootNode.isObject()) {
                // Handle direct object format
                return mapper.convertValue(rootNode, new TypeReference<Map<String, String>>() {});
            }

            return specifications;

        } catch (Exception e) {
            System.err.println("Error parsing specifications JSON: " + e.getMessage());
            System.err.println("Problematic JSON: " + specificationsJson);
            return Map.of();
        }
    }

    private ProductImageResponseDTO convertToImageResponseDTO(Product_image image) {
        ProductImageResponseDTO dto = new ProductImageResponseDTO();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setImageName(image.getImageName());
        dto.setDisplayOrder(image.getDisplayOrder());
        return dto;
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponseDTO> getProductById(Long id) {
        Optional<Product> productOptional = productRepository.findByIdWithImages(id);

        if (productOptional.isEmpty()) {
            return Optional.empty();
        }

        Product product = productOptional.get();
        if (!product.getEnabled()) {
            return Optional.empty();
        }

        return Optional.of(convertToResponseDTO(product));
    }

    //additional

    private void updateProductDetailsInJson(Product product, ProductRequestDTO productRequest) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File jsonFile = new File(productDetailsJsonFile);

            ObjectNode rootNode = mapper.createObjectNode();
            ArrayNode productsArray = mapper.createArrayNode();

            // Read existing JSON file if it exists
            if (jsonFile.exists()) {
                try {
                    JsonNode existingJson = mapper.readTree(jsonFile);
                    if (existingJson.isArray()) {
                        productsArray.addAll((ArrayNode) existingJson);
                    } else if (existingJson.isObject() && existingJson.has("products")) {
                        JsonNode productsNode = existingJson.get("products");
                        if (productsNode.isArray()) {
                            productsArray.addAll((ArrayNode) productsNode);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Could not read existing JSON file: " + e.getMessage());
                }
            }

            // Remove existing product if it exists
            for (int i = 0; i < productsArray.size(); i++) {
                JsonNode productNode = productsArray.get(i);
                if (productNode.has("id") && productNode.get("id").asLong() == product.getId()) {
                    productsArray.remove(i);
                    break;
                }
            }

            // Add updated product
            ObjectNode productNode = mapper.createObjectNode();
            productNode.put("id", product.getId());
            productNode.put("name", productRequest.getName());
            productNode.put("summary", productRequest.getSummary());
            productNode.put("description", productRequest.getDescription());
            productNode.put("overview", productRequest.getOverview());
            productNode.put("price", productRequest.getPrice());
            productNode.put("enabled", productRequest.getEnabled());

            productsArray.add(productNode);
            rootNode.set("products", productsArray);

            mapper.writerWithDefaultPrettyPrinter().writeValue(jsonFile, rootNode);

        } catch (Exception e) {
            System.err.println("Error updating product details in JSON file: " + e.getMessage());
        }
    }

    private void removeProductFromJson(Long productId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File jsonFile = new File(productDetailsJsonFile);

            if (!jsonFile.exists()) {
                return;
            }

            JsonNode existingJson = mapper.readTree(jsonFile);
            ArrayNode productsArray = mapper.createArrayNode();

            if (existingJson.isArray()) {
                productsArray.addAll((ArrayNode) existingJson);
            } else if (existingJson.isObject() && existingJson.has("products")) {
                JsonNode productsNode = existingJson.get("products");
                if (productsNode.isArray()) {
                    productsArray.addAll((ArrayNode) productsNode);
                }
            }

            // Remove the product with the given ID
            for (int i = 0; i < productsArray.size(); i++) {
                JsonNode productNode = productsArray.get(i);
                if (productNode.has("id") && productNode.get("id").asLong() == productId) {
                    productsArray.remove(i);
                    break;
                }
            }

            // Write updated JSON
            ObjectNode rootNode = mapper.createObjectNode();
            rootNode.set("products", productsArray);
            mapper.writerWithDefaultPrettyPrinter().writeValue(jsonFile, rootNode);

        } catch (Exception e) {
            System.err.println("Error removing product from JSON file: " + e.getMessage());
        }
    }

    private void appendProductDetailsToJson(Product product, ProductRequestDTO productRequest) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File jsonFile = new File(productDetailsJsonFile);

            // Root node to be written
            ObjectNode rootNode = mapper.createObjectNode();
            ArrayNode productsArray = mapper.createArrayNode();

            // Read existing JSON file if it exists
            if (jsonFile.exists()) {
                try {
                    JsonNode existingJson = mapper.readTree(jsonFile);

                    // Check if the root is an array (legacy format)
                    if (existingJson.isArray()) {
                        // If it's an array, just append the new Product directly to the array
                        productsArray.addAll((ArrayNode) existingJson);
                    }
                    // Check if it's an object with a "products" property
                    else if (existingJson.isObject() && existingJson.has("products")) {
                        JsonNode productsNode = existingJson.get("products");
                        if (productsNode.isArray()) {
                            // If it's an array, copy the existing products
                            productsArray.addAll((ArrayNode) productsNode);
                        }
                    }
                } catch (Exception e) {
                    // If file reading fails, start with an empty array
                    System.err.println("Could not read existing JSON file, starting fresh: " + e.getMessage());
                }
            }

            // Create the Product object to be added
            ObjectNode productNode = mapper.createObjectNode();
            productNode.put("id", product.getId());
            productNode.put("name", productRequest.getName());
            productNode.put("summary", productRequest.getSummary());
            productNode.put("description", productRequest.getDescription());
            productNode.put("overview", productRequest.getOverview());
            productNode.put("price", productRequest.getPrice());
            productNode.put("enabled", productRequest.getEnabled());

            // Add new Product to the array
            productsArray.add(productNode);

            // Set the products array in the root node
            rootNode.set("products", productsArray);

            // Write the updated JSON back to the file
            mapper.writerWithDefaultPrettyPrinter().writeValue(jsonFile, rootNode);

        } catch (Exception e) {
            System.err.println("Error appending Product details to JSON file: " + e.getMessage());
            e.printStackTrace();
        }
    }

}