package com.slneurorobotics.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddressRequestDTO {

    @NotBlank(message = "Full Name is required")
    private String name;

    @NotBlank(message = "Street Address is required")
    private String streetAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Zip Code is required")
    private String zipCode;

    private boolean defaultAddress;

    private Long createdBy;



}
