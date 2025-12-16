package com.uep.freelance.service;

import com.uep.freelance.dto.JobRequest;
import com.uep.freelance.model.*;
import com.uep.freelance.repository.JobRepository;
import com.uep.freelance.repository.ProposalRepository;
import com.uep.freelance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    public List<Job> getAllOpenJobs() {
        return jobRepository.findByStatus(JobStatus.OPEN);
    }

    public List<Job> getJobsByCategory(JobCategory category) {
        return jobRepository.findByCategory(category);
    }

    public Job createJob(JobRequest jobRequest, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Job job = new Job(
                jobRequest.getTitle(),
                jobRequest.getDescription(),
                jobRequest.getBudget(),
                jobRequest.getDeadline(),
                client,
                jobRequest.getCategory()
        );

        return jobRepository.save(job);
    }

    public Proposal submitProposal(Long jobId, String studentEmail, String coverLetter,
                                   BigDecimal proposedAmount, Integer estimatedDays) {
        if (jobId == null) throw new IllegalArgumentException("JobId cannot be null");
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if student already submitted a proposal
        Optional<Proposal> existingProposal = proposalRepository.findByJobIdAndStudentId(jobId, student.getId());
        if (existingProposal.isPresent()) {
            throw new RuntimeException("You have already submitted a proposal for this job");
        }

        Proposal proposal = new Proposal(job, student, coverLetter, proposedAmount, estimatedDays);
        return proposalRepository.save(proposal);
    }

    @Transactional
    public Job acceptProposal(Long proposalId, String clientEmail) {
        if (proposalId == null) throw new IllegalArgumentException("ProposalId cannot be null");
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        Job job = proposal.getJob();

        // Verify client owns the job
        if (!job.getClient().getEmail().equals(clientEmail)) {
            throw new RuntimeException("Unauthorized to accept proposals for this job");
        }

        // Update job status and assign student
        job.setStatus(JobStatus.IN_PROGRESS);
        job.setAssignedStudent(proposal.getStudent());

        // Reject all other proposals
        List<Proposal> otherProposals = proposalRepository.findByJobId(job.getId());
        for (Proposal p : otherProposals) {
            if (!p.getId().equals(proposalId)) {
                p.setStatus(ProposalStatus.REJECTED);
                proposalRepository.save(p);
            }
        }
        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposalRepository.save(proposal);

        return jobRepository.save(job);
    }

    public List<Job> getClientJobs(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return jobRepository.findByClientId(client.getId());
    }

    public List<Job> getStudentJobs(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return jobRepository.findByAssignedStudentId(student.getId());
    }

    public Job getJobById(Long jobId) {
        if (jobId == null) throw new IllegalArgumentException("JobId cannot be null");
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Proposal> getJobProposals(Long jobId) {
        return proposalRepository.findByJobId(jobId);
    }

    public List<Proposal> getStudentProposals(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return proposalRepository.findByStudentId(student.getId());
    }
}