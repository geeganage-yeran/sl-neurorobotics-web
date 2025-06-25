package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = 'USER'")
    List<User> findAllRegularUsers();

    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);

}
