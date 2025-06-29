package com.slneurorobotics.backend.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PythonServiceRequestDTO {
    private String question;
    private List<ProductForChatbotDTO> products;
}
