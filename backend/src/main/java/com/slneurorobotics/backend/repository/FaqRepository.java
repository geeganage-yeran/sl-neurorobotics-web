package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<FAQ, Long> {
}
