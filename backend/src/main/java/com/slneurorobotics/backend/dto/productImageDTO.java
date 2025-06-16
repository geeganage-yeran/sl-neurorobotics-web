package com.slneurorobotics.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class productImageDTO {
    private String imageName;
    private Integer displayOrder;
    private MultipartFile file;
}
