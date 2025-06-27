package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.request.FaqRequestDTO;
import com.slneurorobotics.backend.dto.request.PasswordChangeDTO;
import com.slneurorobotics.backend.dto.request.ProductRequestDTO;
import com.slneurorobotics.backend.dto.request.UserSettingUpdateDTO;
import com.slneurorobotics.backend.dto.response.FaqResponseDTO;
import com.slneurorobotics.backend.dto.response.UserResponseDTO;
import com.slneurorobotics.backend.dto.response.UserSettingResponseDTO;
import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.service.FaqService;
import com.slneurorobotics.backend.service.PasswordService;
import com.slneurorobotics.backend.service.ProductService;
import com.slneurorobotics.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
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




}
