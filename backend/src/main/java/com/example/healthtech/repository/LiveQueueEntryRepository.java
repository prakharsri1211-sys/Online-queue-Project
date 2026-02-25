package com.example.healthtech.repository;

import com.example.healthtech.model.LiveQueueEntry;
import com.example.healthtech.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LiveQueueEntryRepository extends JpaRepository<LiveQueueEntry, Long> {
    Optional<LiveQueueEntry> findByPatient(Patient patient);
    List<LiveQueueEntry> findByServedFalseOrderByTokenNumberAsc();
    LiveQueueEntry findTopByOrderByTokenNumberDesc();
}
