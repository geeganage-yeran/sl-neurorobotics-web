package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.PasswordChangeDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Transactional
    public boolean changePassword(Long userId, PasswordChangeDTO passwordChangeDto) {
        // Validate password confirmation
        if (!passwordChangeDto.isPasswordConfirmed()) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(passwordChangeDto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        // Validate new password is different from old password
        if (passwordEncoder.matches(passwordChangeDto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // Additional password validation (optional)
        validatePasswordStrength(passwordChangeDto.getNewPassword());

        // Encode and save new password
        String encodedNewPassword = passwordEncoder.encode(passwordChangeDto.getNewPassword());
        user.setPassword(encodedNewPassword);

        // Update last password change timestamp (optional)
//        user.setPasswordLastChanged(java.time.LocalDateTime.now());
        user.setUpdatedById(userId);
        userRepository.save(user);
        return true;
    }

    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Check for at least one uppercase letter
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }

        // Check for at least one lowercase letter
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter");
        }

        // Check for at least one digit
        if (!password.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one number");
        }

        // Check for at least one special character
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character");
        }

        // Check for common weak passwords
        String[] commonPasswords = {"password", "123456", "password123", "admin", "qwerty"};
        String lowercasePassword = password.toLowerCase();
        for (String common : commonPasswords) {
            if (lowercasePassword.contains(common)) {
                throw new IllegalArgumentException("Password contains common patterns and is not secure");
            }
        }
    }

    public boolean verifyCurrentPassword(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return passwordEncoder.matches(password, user.getPassword());
    }
}