package com.slneurorobotics.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddressResponseDTO {

    private long id;

    private String name;

    private String streetAddress;

    private String city;

    private String state;

    private String zipCode;

    private boolean defaultAddress;
}
