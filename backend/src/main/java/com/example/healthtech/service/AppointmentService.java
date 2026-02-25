package com.example.healthtech.service;

import com.example.healthtech.model.*;
import com.example.healthtech.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ApptHistoryRepository apptHistoryRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, ApptHistoryRepository apptHistoryRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.apptHistoryRepository = apptHistoryRepository;
    }

    @Transactional
    public Appointment scheduleAppointment(Long patientId, Long doctorId, LocalDate date, String timeSlot, Boolean isPremium) {
        Patient p = patientRepository.findById(patientId).orElseThrow();
        Doctor d = doctorRepository.findById(doctorId).orElseThrow();

        long existing = appointmentRepository.countByDoctorAndDate(d, date);
        if (d.getMaxPatientsPerDay() != null && existing >= d.getMaxPatientsPerDay()) {
            throw new IllegalStateException("Doctor capacity reached for the date");
        }

        Appointment a = new Appointment();
        a.setPatient(p);
        a.setDoctor(d);
        a.setDate(date);
        a.setTimeSlot(timeSlot);
        a.setIsPremium(isPremium != null ? isPremium : false);

        return appointmentRepository.save(a);
    }

    @Transactional
    public void markConsulted(Long appointmentId, String diagnosis) {
        Appointment a = appointmentRepository.findById(appointmentId).orElseThrow();
        ApptHistory.VisitType vt = apptHistoryRepository.countByPatientId(a.getPatient().getId()) > 0 ? ApptHistory.VisitType.FOLLOW_UP : ApptHistory.VisitType.FIRST_VISIT;

        ApptHistory h = new ApptHistory();
        h.setPatientId(a.getPatient().getId());
        h.setVisitDate(a.getDate());
        h.setDiagnosis(diagnosis);
        h.setVisitType(vt);

        apptHistoryRepository.save(h);
        appointmentRepository.delete(a);
    }
}
