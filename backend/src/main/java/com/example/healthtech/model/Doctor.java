package com.example.healthtech.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
public class Doctor {
    public enum TargetAgeRange { CHILD, ADULT, SENIOR }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String speciality;
    private String qualification;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer bookingWindowDays;
    private Integer maxPatientsPerDay;
    @Enumerated(EnumType.STRING)
    private TargetAgeRange targetAgeRange;
    private Boolean pharmacyAvailable;
    private Boolean wheelchairAccessible;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Integer getBookingWindowDays() { return bookingWindowDays; }
    public void setBookingWindowDays(Integer bookingWindowDays) { this.bookingWindowDays = bookingWindowDays; }
    public Integer getMaxPatientsPerDay() { return maxPatientsPerDay; }
    public void setMaxPatientsPerDay(Integer maxPatientsPerDay) { this.maxPatientsPerDay = maxPatientsPerDay; }
    public TargetAgeRange getTargetAgeRange() { return targetAgeRange; }
    public void setTargetAgeRange(TargetAgeRange targetAgeRange) { this.targetAgeRange = targetAgeRange; }
    public Boolean getPharmacyAvailable() { return pharmacyAvailable; }
    public void setPharmacyAvailable(Boolean pharmacyAvailable) { this.pharmacyAvailable = pharmacyAvailable; }
    public Boolean getWheelchairAccessible() { return wheelchairAccessible; }
    public void setWheelchairAccessible(Boolean wheelchairAccessible) { this.wheelchairAccessible = wheelchairAccessible; }
}
