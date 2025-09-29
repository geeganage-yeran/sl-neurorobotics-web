package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.ThreeDModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ThreeDModelRepository extends JpaRepository<ThreeDModel, Long> {

    List<ThreeDModel> findByProductId(Long productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ThreeDModel t WHERE t.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}