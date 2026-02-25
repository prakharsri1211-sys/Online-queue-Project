package com.example.healthtech.repository;

import com.example.healthtech.model.ApptHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApptHistoryRepository extends JpaRepository<ApptHistory, Long> {
	long countByPatientId(Long patientId);
}
