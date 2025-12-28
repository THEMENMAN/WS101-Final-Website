package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.model.Job;
import com.model.Proposal;
import com.model.ProposalStatus;
import com.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByFreelancer(User freelancer);
    List<Proposal> findByJob(Job job);
    List<Proposal> findByJobAndStatus(Job job, ProposalStatus status);
    List<Proposal> findByFreelancerAndStatus(User freelancer, ProposalStatus status);
    
    @Query("SELECT p FROM Proposal p WHERE p.freelancer.id = :freelancerId AND p.job.id = :jobId")
    Optional<Proposal> findByFreelancerIdAndJobId(@Param("freelancerId") Long freelancerId, 
                                                  @Param("jobId") Long jobId);
    
    @Query("SELECT p FROM Proposal p WHERE p.job.client.id = :clientId")
    List<Proposal> findByClientId(@Param("clientId") Long clientId);
}