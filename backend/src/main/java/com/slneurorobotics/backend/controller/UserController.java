package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.response.CurrentUserResponseDTO;
import com.slneurorobotics.backend.dto.response.ErrorResponseDTO;
import com.slneurorobotics.backend.dto.response.LoginResponseDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

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

}
