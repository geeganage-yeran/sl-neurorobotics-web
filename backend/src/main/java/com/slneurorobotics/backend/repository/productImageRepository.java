package com.slneurorobotics.backend.repository;


import com.slneurorobotics.backend.entity.product_image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productImageRepository extends JpaRepository<product_image, Long> {
}
