package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.PasswordChangeDTO;
import com.slneurorobotics.backend.dto.request.ShippingAddressRequestDTO;
import com.slneurorobotics.backend.dto.request.UserSettingUpdateDTO;
import com.slneurorobotics.backend.dto.response.*;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.service.AuthService;
import com.slneurorobotics.backend.service.FaqService;
import com.slneurorobotics.backend.service.PasswordService;
import com.slneurorobotics.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;
    private final FaqService faqService;
    @Autowired
    private PasswordService passwordService;
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {

            if (authentication == null || !authentication.isAuthenticated()) {
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            String username = authentication.getName();
            User user = authService.getUserByEmail(username);

            if (user == null) {
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            LoginResponseDTO.UserInfoDTO userInfo = LoginResponseDTO.UserInfoDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

            CurrentUserResponseDTO responseDTO = CurrentUserResponseDTO.builder()
                    .success(true)
                    .message("User info retrieved successfully")
                    .userInfo(userInfo)
                    .build();

            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            log.error("Get current user failed", e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Failed to get user info");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/settings/{userid}")
    public UserSettingResponseDTO getUserDetails(@PathVariable Long userid){
        return userService.getUserDetails(userid);
    }

    @PutMapping("/settings/{userId}")
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

    @PutMapping("/password/{userid}")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long userid,
            @RequestBody PasswordChangeDTO passwordChangeDTO) {
        try {
            boolean updated = passwordService.changePassword(userid,passwordChangeDTO);
            if (updated) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/toggleUserStatus/{userid}")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userid) {
        try {
            userService.accountDeactivate(userid);
            return ResponseEntity.ok("User status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user status: " + e.getMessage());
        }
    }

  @GetMapping("/getFaq")
  public ResponseEntity<?> getAllFaqs(){
        try{
            List<FaqResponseDTO> faqs = faqService.getAllFaqs();
            return ResponseEntity.ok(faqs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch FAQs: "+e.getMessage());
        }
  }

  @PostMapping("/addAddress")
  public ResponseEntity<?> addShippingAddress(@RequestBody @Valid ShippingAddressRequestDTO shippingAddressRequestDTO){
        try {
            userService.saveShippingAddress(shippingAddressRequestDTO);
            return ResponseEntity.ok("Shipping Address Add Successfully");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add shipping address: " + e.getMessage());
        }
  }

    @GetMapping("/getAddress")
    public ResponseEntity<?> getAllAddress(){
        try{
            List<ShippingAddressResponseDTO> shippingAddresses = userService.getAllAddress();
            return ResponseEntity.ok(shippingAddresses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch shipping address: "+e.getMessage());
        }
    }

    @DeleteMapping("/deleteAddress/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        try {
            userService.deleteAddress(id);
            return ResponseEntity.ok("Shipping address deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete Shipping address: " + e.getMessage());
        }
    }


}
