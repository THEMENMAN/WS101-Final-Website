package com.uep.freelance.controller;

import com.uep.freelance.dto.JobRequest;
import com.uep.freelance.model.Job;
import com.uep.freelance.model.Proposal;
import com.uep.freelance.model.JobCategory;
import com.uep.freelance.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllOpenJobs() {
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getJobsByCategory(@PathVariable String category) {
        try {
            JobCategory jobCategory = JobCategory.valueOf(category.toUpperCase());
            return ResponseEntity.ok(jobService.getJobsByCategory(jobCategory));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid category: " + category);
        }
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest, Authentication authentication) {
        try {
            String clientEmail = authentication.getName();
            Job job = jobService.createJob(jobRequest, clientEmail);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{jobId}/proposals")
    public ResponseEntity<?> submitProposal(@PathVariable Long jobId, @RequestBody Map<String, Object> proposalData,
                                            Authentication authentication) {
        try {
            String studentEmail = authentication.getName();
            String coverLetter = (String) proposalData.get("coverLetter");
            BigDecimal proposedAmount = new BigDecimal(proposalData.get("proposedAmount").toString());
            Integer estimatedDays = (Integer) proposalData.get("estimatedDays");

            Proposal proposal = jobService.submitProposal(jobId, studentEmail, coverLetter, proposedAmount, estimatedDays);
            return ResponseEntity.ok(proposal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/proposals/{proposalId}/accept")
    public ResponseEntity<?> acceptProposal(@PathVariable Long proposalId, Authentication authentication) {
        try {
            String clientEmail = authentication.getName();
            Job job = jobService.acceptProposal(proposalId, clientEmail);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<?> getMyJobs(Authentication authentication) {
        String userEmail = authentication.getName();

        List<Job> clientJobs = jobService.getClientJobs(userEmail);
        List<Job> studentJobs = jobService.getStudentJobs(userEmail);

        Map<String, Object> response = Map.of(
                "clientJobs", clientJobs,
                "studentJobs", studentJobs
        );

        return ResponseEntity.ok(response);
    }
}