package com.repository;

import com.model.Payment;
import com.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByClient(User client);
    List<Payment> findByFreelancer(User freelancer);
    List<Payment> findByJobId(Long jobId);
}