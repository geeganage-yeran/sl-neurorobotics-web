package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
