package com.example.healthtech.repository;

import com.example.healthtech.model.Appointment;
import com.example.healthtech.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    long countByDoctorAndDate(Doctor doctor, LocalDate date);
}
