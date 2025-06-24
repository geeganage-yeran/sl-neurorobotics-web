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

    // Simple in-memory blacklist
    private final Set<String> blacklistedTokens = new HashSet<>();

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public static class RefreshResult {
        public final String accessToken;
        public final String refreshToken;
        public final LoginResponseDTO responseDto;

        public RefreshResult(String accessToken, String refreshToken, LoginResponseDTO responseDto) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.responseDto = responseDto;
        }
    }

    public RefreshResult refreshAccessToken(String refreshToken) {
        try {

            if (isTokenBlacklisted(refreshToken)) {
                throw new RuntimeException("Refresh token is blacklisted");
            }

            if (!jwtUtil.isRefreshToken(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);


            String newAccessToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);


            if (!refreshToken.equals(newRefreshToken)) {
                blacklistToken(refreshToken);
            }

            LoginResponseDTO responseDto = LoginResponseDTO.builder()
                    .success(true)
                    .message("Token refreshed successfully")
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getExpirationTime() / 1000)
                    .build();

            // Return tokens separately so controller can set them as cookies
            return new RefreshResult(newAccessToken, newRefreshToken, responseDto);

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