package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Shipping_address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShippingAddressRepository extends JpaRepository<Shipping_address,Long> {
    @Query("SELECT sa FROM Shipping_address sa WHERE sa.street_address = ?1 AND sa.city = ?2 AND sa.state = ?3 AND sa.zipcode = ?4")
    List<Shipping_address> findByAddressFields(String streetAddress, String city, String state, String zipcode);
}


