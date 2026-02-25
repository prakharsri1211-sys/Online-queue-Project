package com.example.healthtech.repository;

import com.example.healthtech.model.LiveQueue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveQueueRepository extends JpaRepository<LiveQueue, Long> {
}
