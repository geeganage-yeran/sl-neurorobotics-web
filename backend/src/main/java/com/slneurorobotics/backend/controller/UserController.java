package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.PasswordChangeDTO;
import com.slneurorobotics.backend.dto.request.UserSettingUpdateDTO;
import com.slneurorobotics.backend.dto.response.*;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.service.AuthService;
import com.slneurorobotics.backend.service.PasswordService;
import com.slneurorobotics.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;

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

    private PasswordService passwordService;

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


}
