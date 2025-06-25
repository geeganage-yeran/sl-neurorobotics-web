package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingResponseDTO {
    private String id;
    private String first_name;
    private String last_name;
    private String email;
    private String country;
    private String contact;

}
