package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CurrentUserResponseDTO {
    private boolean success;
    private String message;
    private LoginResponseDTO.UserInfoDTO userInfo;
}