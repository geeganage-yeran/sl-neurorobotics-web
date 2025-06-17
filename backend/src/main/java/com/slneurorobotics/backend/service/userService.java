package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.userRegistrationDTO;
import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.repository.userRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class userService {

    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(userRegistrationDTO userRegistrationDTO) {

        if(!userRegistrationDTO.getPassword().equals(userRegistrationDTO.getConfirmPassword())){
            throw new IllegalArgumentException("Passwords do not match");
        }

        if(userRepository.existsByEmail(userRegistrationDTO.getEmail())){
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = new User();
        user.setFirstName(userRegistrationDTO.getFirstName());
        user.setLastName(userRegistrationDTO.getLastName());
        user.setEmail(userRegistrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        user.setContact(userRegistrationDTO.getContact());
        user.setCountry(userRegistrationDTO.getCountry());
        user.setIs_admin(userRegistrationDTO.getIs_admin());

        userRepository.save(user);
    }
}
