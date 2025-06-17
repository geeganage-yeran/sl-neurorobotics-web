package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.Product_image;
import com.slneurorobotics.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
}
