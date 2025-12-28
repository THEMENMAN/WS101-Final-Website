package com.service;

import com.dto.JobDTO;
import com.model.JobStatus;
import java.util.List;

public interface JobService {
    
    // Create a new job
    JobDTO createJob(JobDTO jobDTO);
    
    // Get all jobs
    List<JobDTO> getAllJobs();
    
    // Get only open jobs
    List<JobDTO> getOpenJobs();
    
    // Get job by ID
    JobDTO getJobById(Long id);
    
    // Get jobs by current client (logged-in user)
    List<JobDTO> getJobsByClient();
    
    // Search jobs by keyword and/or category
    List<JobDTO> searchJobs(String keyword, String category);
    
    // Update job status
    JobDTO updateJobStatus(Long id, JobStatus status);
    
    // Update job details
    JobDTO updateJob(Long id, JobDTO jobDTO);
    
    // Delete a job
    void deleteJob(Long id);
}