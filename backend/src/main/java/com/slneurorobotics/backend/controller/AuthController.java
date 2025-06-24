package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.config.JwtUtil;
import com.slneurorobotics.backend.dto.request.LoginRequestDTO;
import com.slneurorobotics.backend.dto.request.UserRegistrationDTO;
import com.slneurorobotics.backend.dto.response.ErrorResponseDTO;
import com.slneurorobotics.backend.dto.response.LoginResponseDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.service.AuthService;
import com.slneurorobotics.backend.service.UserDetailsServiceImpl;
import com.slneurorobotics.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

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
            BindingResult bindingResult, HttpServletResponse response) {

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

            //Making token access only using Httponly cookies
            setSecureCookie(response, "accessToken", accessToken, (int) (jwtUtil.getExpirationTime() / 1000));
            setSecureCookie(response, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

            // Build responseDTO
            LoginResponseDTO.UserInfoDTO userInfo = LoginResponseDTO.UserInfoDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

            LoginResponseDTO responseDTO = LoginResponseDTO.builder()
                    .success(true)
                    .message("Login successful")
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getExpirationTime() / 1000) // Convert to seconds
                    .userInfo(userInfo)
                    .build();

            log.info("User {} logged in successfully", loginRequest.getEmail());
            return ResponseEntity.ok(responseDTO);

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
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Read refresh token from cookie
            String refreshToken = null;
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }

            if (refreshToken == null) {
                ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Refresh token is required");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            AuthService.RefreshResult result = authService.refreshAccessToken(refreshToken);
            setSecureCookie(response, "accessToken", result.accessToken, (int) (jwtUtil.getExpirationTime() / 1000));
            setSecureCookie(response, "refreshToken", result.refreshToken, 7 * 24 * 60 * 60);

            return ResponseEntity.ok(result.responseDto);

        } catch (Exception e) {
            log.error("Token refresh failed", e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Token refresh failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ErrorResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Read access token from cookie
            String accessToken = null;
            String refreshToken = null;

            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("accessToken".equals(cookie.getName())) {
                        accessToken = cookie.getValue();
                    } else if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                    }
                }
            }

            if (accessToken != null && !accessToken.isEmpty()) {
                authService.blacklistToken(accessToken);
            }

            if (refreshToken != null && !refreshToken.isEmpty()) {
                authService.blacklistToken(refreshToken);
            }

            // Clear cookies
            clearCookie(response, "accessToken");
            clearCookie(response, "refreshToken");

            ErrorResponseDTO responseDTO = new ErrorResponseDTO(true, "Logged out successfully");
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            log.error("Logout failed", e);
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(false, "Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    //For setting HttpOnly cookies
    private void setSecureCookie(HttpServletResponse response, String name, String value, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    //Clear cookies when logout
    private void clearCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }


}
