package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;

    @Value("${company.email:sachindunisal09@gmail.com}")
    private String companyEmail;

    public boolean checkEmailExists(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return false;
            }

            Optional<User> userOptional = userRepository.findByEmail(email.toLowerCase().trim());

            // Check if user exists and is active
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Boolean isActive = user.getIsActive();
                if (isActive != null && isActive) {
                    // Generate 6-digit code
                    String code = generateSixDigitCode();

                    saveVerificationCode(user, code);
                    // Send email
                    sendCodeEmail(email.toLowerCase().trim(), code);

                    return true;
                }
            }

            return false;

        } catch (Exception e) {
            log.error("Error checking email existence for: {}", email, e);
            return false;
        }
    }

    private String generateSixDigitCode() {
        Random random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private void sendCodeEmail(String email, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(companyEmail);
            helper.setTo(email);
            helper.setSubject("Your 6-Digit Code");

            String content = String.format(
                    "<h2>Your Code: <span style='color: blue; font-size: 24px;'>%s</span></h2>",
                    code
            );

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Code {} sent to: {}", code, email);

        } catch (Exception e) {
            log.error("Failed to send code to: {}", email, e);
        }
    }

    public void saveVerificationCode(User user, String code) {
        try {
            // Set verification code
            user.setVerificationCode(passwordEncoder.encode(code));

            // Set expiration time (e.g., 5 minutes from now)
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
            user.setCodeExpirationTime(expirationTime);

            // Update the user in database
            userRepository.save(user);

            log.info("Verification code saved for user: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Error saving verification code for user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to save verification code", e);
        }
    }

    public boolean changePassword(String email, String newPassword) {
        try {
            if (email == null || email.trim().isEmpty()) {
                log.warn("Change password attempt with empty email");
                return false;
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                log.warn("Change password attempt with empty password for email: {}", email);
                return false;
            }

            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(email.toLowerCase().trim());

            if (userOptional.isEmpty()) {
                log.warn("Change password attempt for non-existent user: {}", email);
                return false;
            }

            User user = userOptional.get();

            // Check if user is active
            if (user.getIsActive() == null || !user.getIsActive()) {
                log.warn("Change password attempt for inactive user: {}", email);
                return false;
            }

            // Encode the new password
            String encodedPassword = passwordEncoder.encode(newPassword);

            // Update user password
            user.setPassword(encodedPassword);
            user.setUpdatedAt(LocalDateTime.now());

            // Clear verification code after successful password change
            user.setVerificationCode(null);
            user.setCodeExpirationTime(null);

            // Save user
            userRepository.save(user);

            log.info("Password successfully changed for user: {}", email);
            return true;

        } catch (Exception e) {
            log.error("Error changing password for user: {}", email, e);
            return false;
        }
    }
}
