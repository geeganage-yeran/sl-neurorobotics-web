package com.slneurorobotics.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageDTO {
    private String imageName;
    private Integer displayOrder;
    private MultipartFile file;
}
