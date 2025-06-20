package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.config.JwtUtil;
import com.slneurorobotics.backend.dto.request.LoginRequestDTO;
import com.slneurorobotics.backend.dto.request.UserRegistrationDTO;
import com.slneurorobotics.backend.dto.response.ErrorResponseDTO;
import com.slneurorobotics.backend.dto.response.LoginResponseDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.service.AuthService;
import com.slneurorobotics.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ErrorResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO userRegistrationDTO, BindingResult bindingResult) {
        try {
            if(bindingResult.hasErrors()){
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Validation failed", errors);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            //success response
            userService.registerUser(userRegistrationDTO);
            ErrorResponseDTO successResponse = new ErrorResponseDTO(true, "User registered successfully");
            return ResponseEntity.ok(successResponse);

        }catch (IllegalArgumentException e){
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, e.getMessage());
            errorResponse.setErrorType("BUSINESS_ERROR");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "An unexpected error occurred during registration");
            errorResponse.setErrorType("SYSTEM_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @Valid @RequestBody LoginRequestDTO loginRequest,
            BindingResult bindingResult) {

        try {
            // Validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Validation failed", errors);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Get user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = authService.getUserByEmail(loginRequest.getEmail());

            // Generate tokens
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            // Build response
            LoginResponseDTO.UserInfoDTO userInfo = LoginResponseDTO.UserInfoDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

            LoginResponseDTO response = LoginResponseDTO.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getExpirationTime() / 1000) // Convert to seconds
                    .userInfo(userInfo)
                    .build();

            log.info("User {} logged in successfully", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            log.warn("Login failed for user {}: Invalid credentials", loginRequest.getEmail());
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Invalid email or password");
            errorResponse.setErrorType("AUTHENTICATION_ERROR");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            log.error("Login failed for user {}", loginRequest.getEmail(), e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Login failed. Please try again.");
            errorResponse.setErrorType("SYSTEM_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refresh_token");

            if (refreshToken == null) {
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Refresh token is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Validate refresh token and generate new access token
            LoginResponseDTO response = authService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Token refresh failed", e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Invalid refresh token");
            errorResponse.setErrorType("AUTHENTICATION_ERROR");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ErrorResponseDTO> logout(@RequestHeader("Authorization") String token) {
        try {
            // Extract token from Bearer format
            String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;

            // Add token to blacklist
            authService.blacklistToken(jwt);

            ErrorResponseDTO response = new ErrorResponseDTO(true, "Logged out successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Logout failed", e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


}
