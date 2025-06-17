package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface productRepository extends JpaRepository<Product, Long> {
}
