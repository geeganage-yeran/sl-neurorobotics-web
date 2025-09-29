package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.User;
import com.slneurorobotics.backend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Long countByIsActive(Boolean isActive);

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = 'USER'")
    List<User> findAllRegularUsers();

    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = :isActive AND u.lastLogin > :lastLoginDate")
    Long countByIsActiveAndLastLoginAfter(@Param("isActive") Boolean isActive, @Param("lastLoginDate") LocalDateTime lastLoginDate);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = :isActive AND u.lastLogin BETWEEN :startDate AND :endDate")
    Long countByIsActiveAndLastLoginBetween(@Param("isActive") Boolean isActive, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
