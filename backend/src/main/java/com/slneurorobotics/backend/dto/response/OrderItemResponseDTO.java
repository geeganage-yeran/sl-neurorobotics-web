package com.slneurorobotics.backend.dto.response;

import com.slneurorobotics.backend.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDTO {

    private Long orderItemId;

    private Long productId;

    private String productName;

    private String productImage;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;

    private String productDescription;

}