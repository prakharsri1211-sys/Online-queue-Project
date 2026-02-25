package com.example.healthtech.controller;

import com.example.healthtech.model.Account;
import com.example.healthtech.model.Patient;
import com.example.healthtech.repository.AccountRepository;
import com.example.healthtech.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountRepository accountRepository;
    private final PatientRepository patientRepository;

    public AccountController(AccountRepository accountRepository, PatientRepository patientRepository) {
        this.accountRepository = accountRepository;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Account> login(@RequestBody Account loginRequest) {
        String phone = loginRequest.getPhoneNumber();
        String aadhar = loginRequest.getPrimaryAadharNumber();
        Optional<Account> existingAccount = accountRepository.findByPhoneNumberAndPrimaryAadharNumber(phone, aadhar);
        if (existingAccount.isPresent()) {
            return ResponseEntity.ok(existingAccount.get());
        } else {
            Account newAccount = new Account();
            newAccount.setPhoneNumber(phone);
            newAccount.setPrimaryAadharNumber(aadhar);
            newAccount.setPatients(new java.util.ArrayList<>());
            return ResponseEntity.status(HttpStatus.CREATED).body(accountRepository.save(newAccount));
        }
    }

    @PostMapping("/{accountId}/patients")
    public ResponseEntity<?> addPatient(@PathVariable Long accountId, @RequestBody Patient patientRequest) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Account account = accountOptional.get();
        if (account.getPatients().size() >= 5) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot add more than 5 patients to an account.");
        }

        patientRequest.setAccount(account);
        Patient savedPatient = patientRepository.save(patientRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }

    @GetMapping("/{accountId}/patients")
    public ResponseEntity<List<Patient>> getPatients(@PathVariable Long accountId) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(accountOptional.get().getPatients());
    }
}
