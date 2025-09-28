package com.slneurorobotics.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckEmailResponseDTO {

    private boolean success;
    private String message;
    private boolean emailExists;
    private String email;
}
