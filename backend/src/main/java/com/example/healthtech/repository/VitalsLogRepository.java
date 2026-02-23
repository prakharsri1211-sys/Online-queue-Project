package com.example.healthtech.repository;

import com.example.healthtech.model.VitalsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VitalsLogRepository extends JpaRepository<VitalsLog, Long> {
}
