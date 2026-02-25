package com.example.healthtech.repository;

import com.example.healthtech.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByPhoneNumber(String phoneNumber);
    Optional<Account> findByPhoneNumberAndPrimaryAadharNumber(String phoneNumber, String primaryAadharNumber);
}
