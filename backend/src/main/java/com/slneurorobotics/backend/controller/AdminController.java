package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.request.FaqRequestDTO;
import com.slneurorobotics.backend.dto.request.PasswordChangeDTO;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.dto.request.UserSettingUpdateDTO;
import com.slneurorobotics.backend.dto.response.*;
import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.service.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private PasswordService passwordService;
    private final FaqService faqService;

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

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsForAdmin() {
        try {
            List<ProductResponseDTO> products = productService.getAllProductsForAdmin();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponseDTO> getProductByIdForAdmin(@PathVariable Long id) {
        try {
            Optional<ProductResponseDTO> product = productService.getProductByIdForAdmin(id);
            return product.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("product") String productJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "imageNames", required = false) List<String> imageNames,
            @RequestParam(value = "displayOrders", required = false) List<Integer> displayOrders,
            @RequestParam(value = "keepExistingImages", required = false, defaultValue = "true") boolean keepExistingImages,
            @RequestParam(value = "removedImageIds", required = false) List<Long> removedImageIds) {
        try {
            ProductRequestDTO productRequest = objectMapper.readValue(productJson, ProductRequestDTO.class);
            productService.updateProduct(id, productRequest, images, imageNames, displayOrders, keepExistingImages, removedImageIds);
            return ResponseEntity.ok("Product updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update Product: " + e.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Product: " + e.getMessage());
        }
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        try {
            List<UserResponseDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/toggleUserStatus/{userId}")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        try {
            userService.toggleUserStatus(userId);
            return ResponseEntity.ok("User status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user status: " + e.getMessage());
        }
    }

    @PostMapping("/addFaq")
    public ResponseEntity<?> addFaq(@RequestBody @Valid FaqRequestDTO faqRequestDTO) {
        try {
            faqService.saveFaq(faqRequestDTO);
            return ResponseEntity.ok("FAQ created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create FAQ: " + e.getMessage());
        }
    }

    @GetMapping("/getFaq")
    public ResponseEntity<?> getAllFaqs() {
        try {
            List<FaqResponseDTO> faqs = faqService.getAllFaqs();
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch FAQs: " + e.getMessage());
        }
    }

    @PutMapping("/updateFaq/{id}")
    public ResponseEntity<?> updateFaq(@PathVariable Long id, @RequestBody @Valid FaqRequestDTO faqUpdateRequestDTO) {
        try {
            FAQ updatedFaq = faqService.updateFaq(id, faqUpdateRequestDTO);
            return ResponseEntity.ok(updatedFaq);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update FAQ: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteFaq/{id}")
    public ResponseEntity<?> deleteFaq(@PathVariable Long id) {
        try {
            faqService.deleteFaq(id);
            return ResponseEntity.ok("FAQ deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete FAQ: " + e.getMessage());
        }
    }

    @GetMapping("/getProfile/{userid}")
    public UserSettingResponseDTO getUserDetails(@PathVariable Long userid){
        return userService.getUserDetails(userid);
    }

    @PutMapping("/updateProfile/{userId}")
    public ResponseEntity<?> updateUserSettings(
            @PathVariable Long userId,
            @RequestBody UserSettingUpdateDTO updateDTO) {
        try {
            boolean updated = userService.updateUserSettings(userId, updateDTO);
            if (updated) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updatePassword/{userid}")
    public ResponseEntity<?> updatePassword(
            @PathVariable("userid") Long userId,
            @Valid @RequestBody PasswordChangeDTO passwordChangeDTO) {

        try {
            boolean success = userService.updatePassword(userId, passwordChangeDTO);
            if (success) {
                return ResponseEntity.ok().body(Map.of(
                        "message", "Password updated successfully",
                        "success", true
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Failed to update password",
                        "success", false
                ));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage(),
                    "success", false
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "An error occurred while updating password",
                    "success", false
            ));
        }
    }

    @GetMapping("/orders/all")
    public ResponseEntity<?> getAllOrders(@RequestParam(required = false) String status) {
        try {
            log.info("Fetching all orders - status: {}", status);

            List<OrderResponseDTO> orders = orderService.getAllOrdersWithDetails(status);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", orders,
                    "count", orders.size()
            ));

        } catch (Exception e) {
            log.error("Error fetching all orders: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch orders"
                    ));
        }
    }

    /**
     * Update order tracking information
     */
    @PutMapping("/orders/{orderId}/tracking")
    public ResponseEntity<?> updateOrderTracking(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String trackingNumber = requestBody.get("trackingNumber");
            String trackingLink = requestBody.get("trackingLink");

            if (trackingNumber == null || trackingNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "message", "Tracking number is required"
                        ));
            }

            if (trackingLink == null || trackingLink.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "message", "Tracking link is required"
                        ));
            }

            orderService.updateOrderTracking(orderId, trackingNumber, trackingLink);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Tracking information updated successfully"
            ));

        } catch (RuntimeException e) {
            log.error("Error updating tracking for order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error updating tracking: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }

    /**
     * Cancel Orders
     */
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {
        try {

            String reason = requestBody.get("reason");
            orderService.cancelOrder(orderId,reason);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order cancelled successfully"
            ));

        } catch (RuntimeException e) {
            log.error("Error updating tracking for order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error updating tracking: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }

    @PutMapping("/orders/{orderId}/complete")
    public ResponseEntity<?> completeOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {
        try {

            orderService.completeOrder(orderId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order cancelled successfully"
            ));

        } catch (RuntimeException e) {
            log.error("Error updating tracking for order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error updating tracking: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }

}
