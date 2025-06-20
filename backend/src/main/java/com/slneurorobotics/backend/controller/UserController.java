package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.response.ErrorResponseDTO;
import com.slneurorobotics.backend.dto.request.UserRegistrationDTO;
import com.slneurorobotics.backend.service.UserService;
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
public class UserController {

    private final UserService userService;

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



}
