package com.service;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dto.ProposalDTO;
import com.model.Job;
import com.model.Proposal;
import com.model.ProposalStatus;
import com.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProposalService {
    
    @Autowired
    private ProposalRepository proposalRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JobService jobService;
    
    public ProposalDTO submitProposal(Long jobId, ProposalDTO proposalDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User freelancer = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.model.User job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Check if freelancer already submitted a proposal
        proposalRepository.findByFreelancerIdAndJobId(((ProposalDTO) freelancer).getId(), jobId)
                .ifPresent(p -> {
                    throw new RuntimeException("You have already submitted a proposal for this job");
                });
        
        Proposal proposal = new Proposal();
        proposal.setCoverLetter(proposalDTO.getCoverLetter());
        proposal.setProposedAmount(proposalDTO.getProposedAmount());
        proposal.setEstimatedDays(proposalDTO.getEstimatedDays());
        proposal.setJob(job);
        proposal.setFreelancer(freelancer);
        proposal.setStatus(ProposalStatus.PENDING);
        
        Proposal savedProposal = proposalRepository.save(proposal);
        return convertToDTO(savedProposal);
    }
    
    public List<ProposalDTO> getMyProposals() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User freelancer = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return proposalRepository.findByFreelancer(freelancer).stream()
                .max(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProposalDTO> getProposalsByJob(Long jobId) {
        com.model.User job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        return proposalRepository.findByJob(job).stream()
                .max(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProposalDTO> getProposalsByStatus(String status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User freelancer = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return proposalRepository.findByFreelancerAndStatus(freelancer, ProposalStatus.valueOf(status))
                .stream()
                .max(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProposalDTO updateProposalStatus(Long proposalId, ProposalStatus status) {
        com.model.User proposal = proposalRepository.findByJob(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
        
        proposal.setStatus(status);
        Proposal updatedProposal = proposalRepository.save(proposal);
        return convertToDTO(updatedProposal);
    }
    
    public void withdrawProposal(Long proposalId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User freelancer = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.model.User proposal = proposalRepository.findByJob(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
        
        if (!proposal.getFreelancer().getId().equals(((ProposalDTO) freelancer).getId())) {
            throw new RuntimeException("You can only withdraw your own proposals");
        }
        
        proposal.setStatus(ProposalStatus.WITHDRAWN);
        proposalRepository.save(proposal);
    }
    
    public ProposalDTO getProposalById(Long id) {
        com.model.User proposal = proposalRepository.findByJob(id)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
        return convertToDTO(proposal);
    }
    
    private ProposalDTO convertToDTO(com.model.User proposal) {
        ProposalDTO dto = new ProposalDTO();
        dto.setId(proposal.getId());
        dto.setCoverLetter(proposal.getCoverLetter());
        dto.setProposedAmount(proposal.getProposals());
        dto.setEstimatedDays(proposal.getEstimatedDays());
        dto.setStatus(proposal.getStatus().name());
        dto.setSubmittedAt(proposal.getSubmittedAt());
        dto.setJob(jobService.convertToDTO(proposal.getJob()));
        dto.setFreelancer(userService.convertToDTO(proposal.getFreelancer()));
        return dto;
    }
}