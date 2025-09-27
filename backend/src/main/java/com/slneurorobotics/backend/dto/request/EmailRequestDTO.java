package com.slneurorobotics.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestDTO {

    private String name;
    private String email;
    private String contactNumber;
    private String country;
    private String message;


}
