
package com.controller;  // Fixed package path

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import com.dto.JobDTO;
import com.model.JobStatus;
import com.service.JobService;
import java.util.List;
import java.util.NoSuchElementException;
import java.time.Instant; 

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
@Validated
public class JobController {

    private static final Logger logger = LoggerFactory.getLogger(JobController.class);

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createJob(@Valid @RequestBody JobDTO jobDTO) {
        try {
            JobDTO createdJob = jobService.createJob(jobDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to create job: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage(), Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Unexpected error creating job", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllJobs() {
        try {
            List<JobDTO> jobs = jobService.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error fetching all jobs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @GetMapping(value = "/open", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getOpenJobs() {
        try {
            List<JobDTO> jobs = jobService.getOpenJobs();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error fetching open jobs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getJobById(@PathVariable @Positive Long id) {
        try {
            JobDTO job = jobService.getJobById(id);
            return ResponseEntity.ok(job);
        } catch (NoSuchElementException e) {
            logger.warn("Job not found with id {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Job not found", Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Error fetching job by id {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @GetMapping(value = "/my-jobs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyJobs() {
        try {
            List<JobDTO> jobs = jobService.getJobsByClient();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error fetching client's jobs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchJobs(@RequestParam(required = false) String keyword,
                                        @RequestParam(required = false) String category) {
        try {
            List<JobDTO> jobs = jobService.searchJobs(keyword, category);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error searching jobs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @PutMapping(value = "/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateJobStatus(@PathVariable @Positive Long id, @RequestParam JobStatus status) {
        try {
            JobDTO updatedJob = jobService.updateJobStatus(id, status);
            return ResponseEntity.ok(updatedJob);
        } catch (NoSuchElementException e) {
            logger.warn("Cannot update status, job not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Job not found", Instant.now().toEpochMilli()));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid status update for job {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage(), Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Error updating job status {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateJob(@PathVariable @Positive Long id, @Valid @RequestBody JobDTO jobDTO) {
        try {
            JobDTO updatedJob = jobService.updateJob(id, jobDTO);
            return ResponseEntity.ok(updatedJob);
        } catch (NoSuchElementException e) {
            logger.warn("Cannot update, job not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Job not found", Instant.now().toEpochMilli()));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid job update for {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage(), Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Error updating job {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable @Positive Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            logger.warn("Cannot delete, job not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Job not found", Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Error deleting job {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    // Simple structured error payload
    private static class ApiError {
        private final String message;
        private final long timestamp;

        public ApiError(String message, long timestamp) {
            this.message = message;
            this.timestamp = timestamp;
        }

        public String getMessage() {
            return message;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}