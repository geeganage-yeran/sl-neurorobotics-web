package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomePageDeviceResponseDTO {

    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime updatedAt;
}
