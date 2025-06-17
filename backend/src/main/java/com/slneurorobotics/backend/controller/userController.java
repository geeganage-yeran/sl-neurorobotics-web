package com.slneurorobotics.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slneurorobotics.backend.dto.errorResponseDTO;
import com.slneurorobotics.backend.dto.userRegistrationDTO;
import com.slneurorobotics.backend.service.userService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class userController {

    private final ObjectMapper objectMapper;
    private final userService userService;

    @PostMapping("/register")
    public ResponseEntity<errorResponseDTO> registerUser(@Valid @RequestBody userRegistrationDTO userRegistrationDTO, BindingResult bindingResult) {
        try {
            if(bindingResult.hasErrors()){
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
                errorResponseDTO errorResponse = new errorResponseDTO(false, "Validation failed", errors);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            //success response
            userService.registerUser(userRegistrationDTO);
            errorResponseDTO successResponse = new errorResponseDTO(true, "User registered successfully");
            return ResponseEntity.ok(successResponse);

        }catch (IllegalArgumentException e){
            errorResponseDTO errorResponse = new errorResponseDTO(false, e.getMessage());
            errorResponse.setErrorType("BUSINESS_ERROR");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            errorResponseDTO errorResponse = new errorResponseDTO(false, "An unexpected error occurred during registration");
            errorResponse.setErrorType("SYSTEM_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }



}
