package com.uep.freelance.repository;

import com.uep.freelance.model.Payment;
import com.uep.freelance.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByJobId(Long jobId);
    List<Payment> findByStatus(PaymentStatus status);
}