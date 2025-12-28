package com.repository;

import com.model.Job;
import com.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByStatus(JobStatus status);
    
    List<Job> findByTitleContaining(String keyword);
    
    List<Job> findByCategory(String category);
    
    List<Job> findByTitleContainingAndCategory(String keyword, String category);
    
    // Add this if you have client relationship
    // List<Job> findByClientId(Long clientId);
}