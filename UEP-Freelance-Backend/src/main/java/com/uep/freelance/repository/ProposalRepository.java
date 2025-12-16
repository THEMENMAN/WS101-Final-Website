package com.uep.freelance.repository;

import com.uep.freelance.model.Proposal;
import com.uep.freelance.model.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByJobId(Long jobId);
    List<Proposal> findByStudentId(Long studentId);
    Optional<Proposal> findByJobIdAndStudentId(Long jobId, Long studentId);
    List<Proposal> findByStatus(ProposalStatus status);
    List<Proposal> findByJobClientId(Long clientId);
}