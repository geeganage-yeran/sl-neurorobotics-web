package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.HomePageDevice;
import com.slneurorobotics.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomePageDeviceRepository extends JpaRepository<HomePageDevice, Long> {
    Optional<HomePageDevice> findFirstByOrderByUpdatedAtDesc();

    List<HomePageDevice> findAllByOrderByUpdatedAtDesc();

}