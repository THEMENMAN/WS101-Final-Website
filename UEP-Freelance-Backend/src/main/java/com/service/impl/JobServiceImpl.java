package com.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.service.JobService;
import com.dto.JobDTO;
import com.model.JobStatus;
import com.model.Job;
import com.repository.JobRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    // You'll need to convert Job to JobDTO and vice versa
    // Here's a helper method (you'll need to implement the full conversion)
    private JobDTO convertToDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setBudget(job.getBudget());
        dto.setDeadline(job.getDeadline());
        dto.setStatus(job.getStatus());
        dto.setCategory(job.getCategory());
        // Set other fields as needed
        return dto;
    }
    
    private Job convertToEntity(JobDTO dto) {
        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setBudget(dto.getBudget());
        job.setDeadline(dto.getDeadline());
        job.setStatus(dto.getStatus());
        job.setCategory(dto.getCategory());
        // Set other fields as needed
        return job;
    }
    
    @Override
    public JobDTO createJob(JobDTO jobDTO) {
        Job job = convertToEntity(jobDTO);
        job.setStatus(JobStatus.OPEN); // Default status
        Job savedJob = jobRepository.save(job);
        return convertToDTO(savedJob);
    }
    
    @Override
    public List<JobDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream()
                   .map(this::convertToDTO)
                   .collect(Collectors.toList());
    }
    
    @Override
    public List<JobDTO> getOpenJobs() {
        List<Job> jobs = jobRepository.findByStatus(JobStatus.OPEN);
        return jobs.stream()
                   .map(this::convertToDTO)
                   .collect(Collectors.toList());
    }
    
    @Override
    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return convertToDTO(job);
    }
    
    @Override
    public List<JobDTO> getJobsByClient() {
        // Get current user ID from security context
        // Long currentUserId = getCurrentUserId();
        // List<Job> jobs = jobRepository.findByClientId(currentUserId);
        // For now, return empty list - implement with authentication
        return List.of();
    }
    
    @Override
    public List<JobDTO> searchJobs(String keyword, String category) {
        if (keyword != null && category != null) {
            List<Job> jobs = jobRepository.findByTitleContainingAndCategory(keyword, category);
            return jobs.stream()
                       .map(this::convertToDTO)
                       .collect(Collectors.toList());
        } else if (keyword != null) {
            List<Job> jobs = jobRepository.findByTitleContaining(keyword);
            return jobs.stream()
                       .map(this::convertToDTO)
                       .collect(Collectors.toList());
        } else if (category != null) {
            List<Job> jobs = jobRepository.findByCategory(category);
            return jobs.stream()
                       .map(this::convertToDTO)
                       .collect(Collectors.toList());
        } else {
            return getAllJobs();
        }
    }
    
    @Override
    public JobDTO updateJobStatus(Long id, JobStatus status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        job.setStatus(status);
        Job updatedJob = jobRepository.save(job);
        return convertToDTO(updatedJob);
    }
    
    @Override
    public JobDTO updateJob(Long id, JobDTO jobDTO) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        
        // Update fields
        existingJob.setTitle(jobDTO.getTitle());
        existingJob.setDescription(jobDTO.getDescription());
        existingJob.setBudget(jobDTO.getBudget());
        existingJob.setDeadline(jobDTO.getDeadline());
        existingJob.setCategory(jobDTO.getCategory());
        
        Job updatedJob = jobRepository.save(existingJob);
        return convertToDTO(updatedJob);
    }
    
    @Override
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }
}