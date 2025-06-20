package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.config.JwtUtil;
import com.slneurorobotics.backend.dto.response.LoginResponseDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    // Simple in-memory blacklist (use Redis in production)
    private final Set<String> blacklistedTokens = new HashSet<>();

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public LoginResponseDTO refreshAccessToken(String refreshToken) {
        try {
            // Validate refresh token
            if (!jwtUtil.isRefreshToken(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            User user = getUserByEmail(username);

            // Generate new access token
            String newAccessToken = jwtUtil.generateToken(userDetails);

            LoginResponseDTO.UserInfoDTO userInfo = LoginResponseDTO.UserInfoDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

            return LoginResponseDTO.builder()
                    .success(true)
                    .message("Token refreshed successfully")
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // Keep the same refresh token
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getExpirationTime() / 1000)
                    .userInfo(userInfo)
                    .build();

        } catch (Exception e) {
            log.error("Token refresh failed", e);
            throw new RuntimeException("Token refresh failed");
        }
    }

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
        log.info("Token blacklisted successfully");
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}