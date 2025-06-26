package com.slneurorobotics.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqRequestDTO {

    @NotBlank(message = "Question is required")
    @Size(max = 500, message = "Question cannot exceed 500 characters")
    private String question;

    @NotBlank(message = "Answer is required")
    @Size(max = 2000, message = "Answer cannot exceed 2000 characters")
    private String answer;

    private Long createdBy;
}
