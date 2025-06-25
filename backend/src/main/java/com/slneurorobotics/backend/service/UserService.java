package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.UserRegistrationDTO;
import com.slneurorobotics.backend.dto.response.UserResponseDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(UserRegistrationDTO registrationDTO) {
        // Check if user already exists
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setEmail(registrationDTO.getEmail());
        user.setContact(registrationDTO.getContact());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setCountry(registrationDTO.getCountry());
        // role defaults to USER from entity

        userRepository.save(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAllRegularUsers()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
    }

    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId().toString());
        dto.setName(user.getFirstName() + " " + user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setStatus(user.getIsActive() ? "active" : "inactive");
        dto.setLastLogin(user.getLastLogin() != null ? user.getLastLogin() : user.getUpdatedAt());
        dto.setJoinDate(user.getCreatedAt());
        return dto;
    }

}