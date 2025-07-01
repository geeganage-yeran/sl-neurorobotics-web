package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Shipping_address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShippingAddressRepository extends JpaRepository<Shipping_address,Long> {
    @Query("SELECT sa FROM Shipping_address sa WHERE sa.street_address = ?1 AND sa.city = ?2 AND sa.state = ?3 AND sa.zipcode = ?4")
    List<Shipping_address> findByAddressFields(String streetAddress, String city, String state, String zipcode);

    @Query("SELECT s FROM Shipping_address s WHERE s.createdBy = ?1")
    List<Shipping_address> findByAddress(long userid);
<<<<<<< Updated upstream
=======

    @Query("SELECT sa FROM Shipping_address sa WHERE sa.createdBy = :userId AND sa.isDefault = true")
    List<Shipping_address> findByCreatedByAndIsDefaultTrue(@Param("userId") Long userId);

    @Query("SELECT sa FROM Shipping_address sa WHERE sa.createdBy = :userId AND sa.isDefault = true AND sa.id != :currentId")
    List<Shipping_address> findByCreatedByAndIsDefaultTrueAndIdNot(@Param("userId") Long userId, @Param("currentId") Long currentId);

    @Query("SELECT s FROM Shipping_address s WHERE s.createdBy = ?1 AND s.isDefault = true")
    Shipping_address findByDefaultAddress(long userid);
>>>>>>> Stashed changes
}


