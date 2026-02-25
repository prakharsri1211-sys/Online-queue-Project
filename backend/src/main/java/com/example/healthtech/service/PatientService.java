package com.example.healthtech.service;

import com.example.healthtech.model.Account;
import com.example.healthtech.repository.AccountRepository;
import com.example.healthtech.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class PatientService {
    private final AccountRepository accountRepository;
    private final PatientRepository patientRepository;

    public PatientService(AccountRepository accountRepository, PatientRepository patientRepository) {
        this.accountRepository = accountRepository;
        this.patientRepository = patientRepository;
    }

    public Account findOrCreateAccountByPhone(String phoneNumber) {
        // Search for existing account by phone
        Optional<Account> existingAccount = accountRepository.findByPhoneNumber(phoneNumber);
        if (existingAccount.isPresent()) {
            return existingAccount.get();
        }

        // Auto-create new account if not found
        Account newAccount = new Account();
        newAccount.setPhoneNumber(phoneNumber);
        newAccount.setPatients(new ArrayList<>());
        return accountRepository.save(newAccount);
    }
}
