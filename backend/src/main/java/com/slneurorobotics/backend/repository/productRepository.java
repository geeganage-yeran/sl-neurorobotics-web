package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productRepository extends JpaRepository<product, Long> {
}
