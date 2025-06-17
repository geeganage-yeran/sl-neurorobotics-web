package com.slneurorobotics.backend.repository;


import com.slneurorobotics.backend.entity.Product_image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productImageRepository extends JpaRepository<Product_image, Long> {
}
