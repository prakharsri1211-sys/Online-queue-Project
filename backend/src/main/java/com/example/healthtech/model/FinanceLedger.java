package com.example.healthtech.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class FinanceLedger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private Integer totalFee = 500;
    private Integer creditBalance = 0;
    private LocalDate creditExpiryDate;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Integer getTotalFee() { return totalFee; }
    public void setTotalFee(Integer totalFee) { this.totalFee = totalFee; }
    public Integer getCreditBalance() { return creditBalance; }
    public void setCreditBalance(Integer creditBalance) { this.creditBalance = creditBalance; }
    public LocalDate getCreditExpiryDate() { return creditExpiryDate; }
    public void setCreditExpiryDate(LocalDate creditExpiryDate) { this.creditExpiryDate = creditExpiryDate; }
}
