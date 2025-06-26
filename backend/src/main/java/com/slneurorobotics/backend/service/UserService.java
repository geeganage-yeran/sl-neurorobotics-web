package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.UserRegistrationDTO;
import com.slneurorobotics.backend.dto.response.UserResponseDTO;
import com.slneurorobotics.backend.dto.response.UserSettingResponseDTO;
import com.slneurorobotics.backend.dto.request.UserSettingUpdateDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

<<<<<<< nisal2
<<<<<<< Updated upstream
=======
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

>>>>>>> Stashed changes
=======
import java.util.List;
import java.util.stream.Collectors;

>>>>>>> main

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private ModelMapper modelMapper;

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


    public UserSettingResponseDTO getUserDetails(Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            UserSettingResponseDTO responseDTO = new UserSettingResponseDTO();
            responseDTO.setId(user.getId().toString());
            responseDTO.setFirst_name(user.getFirstName());
            responseDTO.setLast_name(user.getLastName());
            responseDTO.setEmail(user.getEmail());
            responseDTO.setCountry(user.getCountry());
            responseDTO.setContact(user.getContact());

            return responseDTO;
        } else {
            return null; // or throw an exception like throw new UserNotFoundException("User not found with id: " + id);
        }
    }

    public boolean updateUserSettings(Long userId, UserSettingUpdateDTO updateDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // Update fields if they are provided
        if (updateDTO.getFirstName() != null && !updateDTO.getFirstName().trim().isEmpty()) {
            user.setFirstName(updateDTO.getFirstName().trim());
        }

        if (updateDTO.getLastName() != null && !updateDTO.getLastName().trim().isEmpty()) {
            user.setLastName(updateDTO.getLastName().trim());
        }

        if (updateDTO.getEmail() != null && !updateDTO.getEmail().trim().isEmpty()) {
            String newEmail = updateDTO.getEmail().trim().toLowerCase();
            // Check if email is already taken by another user
            Optional<User> existingUser = userRepository.findByEmail(newEmail);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new IllegalArgumentException("Email is already in use by another account");
            }
            user.setEmail(newEmail);
        }

        if (updateDTO.getContact() != null && !updateDTO.getContact().trim().isEmpty()) {
            user.setContact(updateDTO.getContact().trim());
        }

        if (updateDTO.getCountry() != null && !updateDTO.getCountry().trim().isEmpty()) {
            user.setCountry(updateDTO.getCountry().trim());
        }

        userRepository.save(user);
        return true;
    }



}