package com.slneurorobotics.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.Product_image;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Value("${product.image.upload.dir}")
    private String productImageUploadDir;

    @Value("${Product.details.json.file:products_details.json}")
    private String productDetailsJsonFile;

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