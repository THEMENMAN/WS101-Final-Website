package com.uep.freelance.repository;

import com.uep.freelance.model.Job;
import com.uep.freelance.model.JobStatus;
import com.uep.freelance.model.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByClientId(Long clientId);
    List<Job> findByAssignedStudentId(Long studentId);
    List<Job> findByCategory(JobCategory category);
}