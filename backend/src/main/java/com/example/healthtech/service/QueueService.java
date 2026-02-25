package com.example.healthtech.service;

import com.example.healthtech.model.*;
import com.example.healthtech.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QueueService {
    private final LiveQueueEntryRepository entryRepository;
    private final LiveQueueRepository queueRepository;
    private final PatientRepository patientRepository;
    private final FinanceLedgerRepository ledgerRepository;

    public QueueService(LiveQueueEntryRepository entryRepository, LiveQueueRepository queueRepository, PatientRepository patientRepository, FinanceLedgerRepository ledgerRepository) {
        this.entryRepository = entryRepository;
        this.queueRepository = queueRepository;
        this.patientRepository = patientRepository;
        this.ledgerRepository = ledgerRepository;
    }

    @Transactional
    public void triggerLateArrival(Long patientId) {
        Patient p = patientRepository.findById(patientId).orElseThrow();
        LiveQueueEntry entry = entryRepository.findByPatient(p).orElseThrow();

        // find current max token
        LiveQueueEntry top = entryRepository.findTopByOrderByTokenNumberDesc();
        int maxToken = top != null && top.getTokenNumber() != null ? top.getTokenNumber() : 0;
        entry.setTokenNumber(maxToken + 1);
        entry.setIssuedAt(LocalDateTime.now());
        entryRepository.save(entry);

        // Deduct ₹100 from FinanceLedger (creditBalance reduced)
        FinanceLedger ledger = ledgerRepository.findByPatientId(patientId).orElseGet(() -> {
            FinanceLedger f = new FinanceLedger();
            f.setPatientId(patientId);
            return f;
        });
        ledger.setCreditBalance(ledger.getCreditBalance() - 100);
        ledger.setCreditExpiryDate(addWorkingDays(LocalDate.now(), 7));
        ledgerRepository.save(ledger);
    }

    private LocalDate addWorkingDays(LocalDate start, int workingDays) {
        LocalDate date = start;
        int added = 0;
        while (added < workingDays) {
            date = date.plusDays(1);
            if (!(date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7)) {
                added++;
            }
        }
        return date;
    }

    public List<LiveQueueEntry> getCurrentQueue() {
        return entryRepository.findByServedFalseOrderByTokenNumberAsc();
    }
}
