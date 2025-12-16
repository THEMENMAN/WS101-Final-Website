package com.uep.freelance.service;

import com.uep.freelance.model.*;
import com.uep.freelance.repository.JobRepository;
import com.uep.freelance.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private JobRepository jobRepository;

    public Payment createEscrowPayment(Long jobId, BigDecimal amount, PaymentMethod method) {
        if (jobId == null) throw new IllegalArgumentException("JobId cannot be null");
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Payment payment = new Payment(job, amount, method);
        payment.setStatus(PaymentStatus.HELD_IN_ESCROW);
        payment.setEscrowAccountId(UUID.randomUUID().toString());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment releasePayment(Long paymentId) {
        if (paymentId == null) throw new IllegalArgumentException("PaymentId cannot be null");
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.RELEASED);
        payment.setReleasedAt(LocalDateTime.now());

        // Update job status to completed
        Job job = payment.getJob();
        job.setStatus(JobStatus.COMPLETED);
        jobRepository.save(job);

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment refundPayment(Long paymentId) {
        if (paymentId == null) throw new IllegalArgumentException("PaymentId cannot be null");
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.REFUNDED);

        // Update job status to cancelled
        Job job = payment.getJob();
        job.setStatus(JobStatus.CANCELLED);
        jobRepository.save(job);

        return paymentRepository.save(payment);
    }

    // Mock payment processing
    public boolean processMockPayment(PaymentMethod method, String accountDetails, BigDecimal amount) {
        // Simulate payment processing
        try {
            Thread.sleep(1000);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    public Payment getPaymentByJobId(Long jobId) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getJob().getId().equals(jobId))
                .findFirst()
                .orElse(null);
    }
}