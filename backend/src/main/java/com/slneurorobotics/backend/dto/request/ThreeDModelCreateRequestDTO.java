package com.slneurorobotics.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreeDModelCreateRequestDTO {
    private Long productId;
    private MultipartFile originalImage;
}
