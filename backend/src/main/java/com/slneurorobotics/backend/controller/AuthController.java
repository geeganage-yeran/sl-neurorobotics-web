package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.config.JwtUtil;
import com.slneurorobotics.backend.dto.request.*;
import com.slneurorobotics.backend.dto.response.*;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import com.slneurorobotics.backend.service.AuthService;
import com.slneurorobotics.backend.service.PasswordResetService;
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
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final UserRepository userRepository;

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

            user.updateLastLogin();
            authService.saveUser(user);
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

    @PostMapping("/reset-password")
    public ResponseEntity<?> checkEmailPost(@Valid @RequestBody CheckEmailRequestDTO requestDTO) {
        try {
            // Validate input
            if (requestDTO.getEmail() == null || requestDTO.getEmail().trim().isEmpty()) {
                CheckEmailResponseDTO response = CheckEmailResponseDTO.builder()
                        .success(false)
                        .message("Email is required")
                        .emailExists(false)
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            boolean emailExists = passwordResetService.checkEmailExists(requestDTO.getEmail());

            CheckEmailResponseDTO response = CheckEmailResponseDTO.builder()
                    .success(emailExists)  // ← Set success based on email existence
                    .message(emailExists ? "Email found and account is active" : "No active account found with this email address")
                    .emailExists(emailExists)
                    .email(requestDTO.getEmail().toLowerCase().trim())
                    .build();

            // Return appropriate HTTP status
            if (emailExists) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok(response);  // Or use 404 if preferred
            }

        } catch (Exception e) {
            log.error("Check email endpoint error for email: {}", requestDTO.getEmail(), e);
            CheckEmailResponseDTO response = CheckEmailResponseDTO.builder()
                    .success(false)
                    .message("An error occurred while checking email")
                    .emailExists(false)
                    .email(requestDTO.getEmail() != null ? requestDTO.getEmail().toLowerCase().trim() : null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@Valid @RequestBody VerifyOTPRequestDTO requestDTO) {
        try {
            log.info("OTP verification attempt for email: {}", requestDTO.getEmail());

            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(requestDTO.getEmail().trim().toLowerCase());

            if (userOpt.isEmpty()) {
                VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                        .success(false)
                        .message("No account found with this email address")
                        .codeMatched(false)
                        .codeExpired(false)
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOpt.get();

            // Check if user has a verification code
            if (user.getVerificationCode() == null || user.getVerificationCode().trim().isEmpty()) {
                VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                        .success(false)
                        .message("No verification code found. Please request a new code.")
                        .codeMatched(false)
                        .codeExpired(false)
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Check if code is expired
            LocalDateTime now = LocalDateTime.now();
            boolean isExpired = user.getCodeExpirationTime() == null || now.isAfter(user.getCodeExpirationTime());

            if (isExpired) {
                log.warn("Expired OTP verification attempt for email: {}", requestDTO.getEmail());
                VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                        .success(false)
                        .message("Verification code has expired. Please request a new code.")
                        .codeMatched(false)
                        .codeExpired(true)
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .expirationTime(user.getCodeExpirationTime())
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Check if OTP matches (using BCrypt for secure comparison if stored as hash)
            boolean codeMatches = false;
            if (user.getVerificationCode().startsWith("$2")) {
                // Code is hashed with BCrypt
                codeMatches = BCrypt.checkpw(requestDTO.getOtp(), user.getVerificationCode());
            } else {
                // Code is stored as plain text (less secure but simpler)
                codeMatches = user.getVerificationCode().equals(requestDTO.getOtp());
            }

            if (codeMatches) {
                log.info("Successful OTP verification for email: {}", requestDTO.getEmail());

                // Optional: Clear the verification code after successful verification
                // user.setVerificationCode(null);
                // user.setCodeExpirationTime(null);
                // userRepository.save(user);

                VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                        .success(true)
                        .message("Verification code verified successfully")
                        .codeMatched(true)
                        .codeExpired(false)
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .expirationTime(user.getCodeExpirationTime())
                        .build();
                return ResponseEntity.ok(response);
            } else {
                log.warn("Invalid OTP verification attempt for email: {}", requestDTO.getEmail());
                VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                        .success(false)
                        .message("Invalid verification code. Please try again.")
                        .codeMatched(false)
                        .codeExpired(false)
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .expirationTime(user.getCodeExpirationTime())
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            log.error("OTP verification error for email: {}", requestDTO.getEmail(), e);
            VerifyOTPResponseDTO response = VerifyOTPResponseDTO.builder()
                    .success(false)
                    .message("An error occurred while verifying the code. Please try again.")
                    .codeMatched(false)
                    .codeExpired(false)
                    .email(requestDTO.getEmail() != null ? requestDTO.getEmail().toLowerCase().trim() : null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequestDTO requestDTO, BindingResult bindingResult) {
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

            // Validate input
            if (requestDTO.getEmail() == null || requestDTO.getEmail().trim().isEmpty()) {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("Email is required")
                        .email(null)
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            if (requestDTO.getNewPassword() == null || requestDTO.getNewPassword().trim().isEmpty()) {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("New password is required")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            // Additional password validation
            if (requestDTO.getNewPassword().length() < 6) {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("Password must be at least 6 characters long")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            // Check if user exists and is active
            Optional<User> userOpt = userRepository.findByEmail(requestDTO.getEmail().toLowerCase().trim());

            if (userOpt.isEmpty()) {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("No account found with this email address")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOpt.get();

            if (user.getIsActive() == null || !user.getIsActive()) {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("Account is not active")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Change password using service
            boolean passwordChanged = passwordResetService.changePassword(
                    requestDTO.getEmail().toLowerCase().trim(),
                    requestDTO.getNewPassword()
            );

            if (passwordChanged) {
                log.info("Password successfully changed for user: {}", requestDTO.getEmail());

                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(true)
                        .message("Password changed successfully")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.ok(response);
            } else {
                ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                        .success(false)
                        .message("Failed to change password. Please try again.")
                        .email(requestDTO.getEmail().toLowerCase().trim())
                        .build();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            log.error("Change password endpoint error for email: {}",
                    requestDTO.getEmail() != null ? requestDTO.getEmail() : "null", e);

            ChangePasswordResponseDTO response = ChangePasswordResponseDTO.builder()
                    .success(false)
                    .message("An error occurred while changing password. Please try again.")
                    .email(requestDTO.getEmail() != null ? requestDTO.getEmail().toLowerCase().trim() : null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



}
