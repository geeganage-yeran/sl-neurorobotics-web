package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.*;
import com.slneurorobotics.backend.dto.response.FaqResponseDTO;
import com.slneurorobotics.backend.dto.response.ShippingAddressResponseDTO;
import com.slneurorobotics.backend.dto.response.UserResponseDTO;
import com.slneurorobotics.backend.dto.response.UserSettingResponseDTO;
import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.entity.Shipping_address;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.FaqRepository;
import com.slneurorobotics.backend.repository.ShippingAddressRepository;
import com.slneurorobotics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FaqRepository faqRepository;
    private final ShippingAddressRepository shippingAddressRepository;

    public void registerUser(UserRegistrationDTO registrationDTO) {
        // Check if user already exists
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        Long currentUserId = getCurrentUserId();

        User user = new User();
        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setEmail(registrationDTO.getEmail());
        user.setContact(registrationDTO.getContact());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setCountry(registrationDTO.getCountry());

        user.setCreatedById(currentUserId);
        user.setUpdatedById(currentUserId);

        userRepository.save(user);
    }

    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !authentication.getPrincipal().equals("anonymousUser")) {

                if (authentication.getPrincipal() instanceof UserDetails) {
                    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                    if (userDetails instanceof User) {
                        return ((User) userDetails).getId();
                    }
                }
            }
        } catch (Exception e) {
            // Log the exception if needed
            System.out.println("Could not get current user ID: " + e.getMessage());
        }
        return null; // For self-registration or system operations
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

        user.setUpdatedById(getCurrentUserId());
        user.setCreatedById(getCurrentUserId());

        userRepository.save(user);
        return true;
    }

    public boolean updatePassword(Long userId, PasswordChangeDTO passwordChangeDTO) {
        if (!passwordChangeDTO.isPasswordConfirmed()) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(passwordChangeDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(passwordChangeDTO.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeDTO.getNewPassword()));
        user.setUpdatedById(getCurrentUserId());

        userRepository.save(user);
        return true;
    }

    public void accountDeactivate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
    }

    public List<FaqResponseDTO> getAllFaqs() {
        List<FAQ> faqs = faqRepository.findAll();
        return faqs.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public FaqResponseDTO convertToResponseDTO(FAQ faq) {
        FaqResponseDTO dto = new FaqResponseDTO();
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        return dto;
    }

    public void saveShippingAddress(ShippingAddressRequestDTO shippingAddressRequestDTO) {

        List<Shipping_address> existingAddresses = shippingAddressRepository.findByAddressFields(
                shippingAddressRequestDTO.getStreetAddress(),
                shippingAddressRequestDTO.getCity(),
                shippingAddressRequestDTO.getState(),
                shippingAddressRequestDTO.getZipCode()
        );

        if (!existingAddresses.isEmpty()) {
            throw new RuntimeException("Shipping address already exists");
        }

        Shipping_address shippingAddress = new Shipping_address();
        shippingAddress.setFull_name(shippingAddressRequestDTO.getName());
        shippingAddress.setStreet_address(shippingAddressRequestDTO.getStreetAddress());
        shippingAddress.setCity(shippingAddressRequestDTO.getCity());
        shippingAddress.setState(shippingAddressRequestDTO.getState());
        shippingAddress.setZipcode(shippingAddressRequestDTO.getZipCode());
        shippingAddress.setDefault(shippingAddressRequestDTO.isDefaultAddress());
        shippingAddress.setCreatedBy(shippingAddressRequestDTO.getCreatedBy());
        shippingAddress.setUpdatedBy(shippingAddressRequestDTO.getCreatedBy());
        shippingAddressRepository.save(shippingAddress);
    }

    public List<ShippingAddressResponseDTO> getAllAddress(Long userid) {
        List<Shipping_address> shippingAddresses = shippingAddressRepository.findByAddress(userid);
        return shippingAddresses.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public ShippingAddressResponseDTO convertToResponseDTO(Shipping_address shippingAddress) {
        ShippingAddressResponseDTO dto = new ShippingAddressResponseDTO();
        dto.setId(shippingAddress.getId());
        dto.setName(shippingAddress.getFull_name());
        dto.setStreetAddress(shippingAddress.getStreet_address());
        dto.setCity(shippingAddress.getCity());
        dto.setState(shippingAddress.getState());
        dto.setZipCode(shippingAddress.getZipcode());
        dto.setDefaultAddress(shippingAddress.isDefault());
        return dto;
    }

    public void deleteAddress(Long id) {
        if (!shippingAddressRepository.existsById(id)) {
            throw new RuntimeException("Shipping address not found with id: " + id);
        }
        shippingAddressRepository.deleteById(id);
    }

    public Shipping_address updateAddress(Long id, ShippingAddressRequestDTO shippingAddressRequestDTO) {
        Shipping_address shippingAddress = shippingAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipping addresss not found with id: " + id));
        shippingAddress.setFull_name(shippingAddressRequestDTO.getName());
        shippingAddress.setStreet_address(shippingAddressRequestDTO.getStreetAddress());
        shippingAddress.setCity(shippingAddressRequestDTO.getCity());
        shippingAddress.setState(shippingAddressRequestDTO.getState());
        shippingAddress.setZipcode(shippingAddressRequestDTO.getZipCode());
        shippingAddress.setDefault(shippingAddressRequestDTO.isDefaultAddress());
        shippingAddress.setCreatedBy(shippingAddressRequestDTO.getCreatedBy());
        shippingAddress.setUpdatedBy(shippingAddressRequestDTO.getCreatedBy());
        return shippingAddressRepository.save(shippingAddress);
    }




}