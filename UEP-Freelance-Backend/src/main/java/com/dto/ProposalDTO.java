package com.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.model.Job;
import com.model.Proposal;
import com.model.ProposalStatus;
import com.model.User;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for proposals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalDTO {
    private Long id;

    @NotBlank(message = "Cover letter is required")
    @Size(max = 2000, message = "Cover letter must be at most 2000 characters")
    private String coverLetter;

    @NotNull(message = "Proposed amount is required")
    @DecimalMin(value = "0.01", message = "Proposed amount must be a positive number")
    private BigDecimal proposedAmount;

    @Positive(message = "Estimated days must be positive")
    private Integer estimatedDays;

    @NotNull(message = "Status is required")
    private ProposalStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime submittedAt;

    private JobDTO job;

    private UserDTO freelancer;

    /** Create a DTO from a domain Proposal model */
    public static ProposalDTO fromModel(Proposal p) {
        if (p == null) return null;

        JobDTO jobDto = null;
        Job job = p.getJob();
        if (job != null) {
            try {
                JobCategory category = null;
                try {
                    category = JobCategory.fromString(job.getCategory());
                } catch (Exception ignored) {
                }
                jobDto = JobDTO.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .description(job.getDescription())
                        .budget(job.getBudget())
                        .deadline(job.getDeadline())
                        .status(job.getStatus())
                        .category(category)
                        .createdAt(job.getCreatedAt() != null ? job.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() : null)
                        .build();
            } catch (Exception ignored) {
            }
        }

        UserDTO userDto = null;
        User u = p.getFreelancer();
        if (u != null) {
            userDto = new UserDTO();
            userDto.setId(u.getId());
            userDto.setEmail(u.getEmail());
            userDto.setFirstName(u.getFirstName());
            userDto.setLastName(u.getLastName());
            userDto.setRole(u.getRole() != null ? u.getRole().name() : null);
            userDto.setPhone(u.getPhone());
            userDto.setSkills(u.getSkills());
            userDto.setBio(u.getBio());
            userDto.setCompany(u.getCompany());
            userDto.setRating(u.getRating());
            userDto.setTotalJobs(u.getTotalJobs());
            userDto.setCompletedJobs(u.getCompletedJobs());
            userDto.setCreatedAt(u.getCreatedAt());
            userDto.setIsActive(u.getIsActive());
        }

        return ProposalDTO.builder()
                .id(p.getId())
                .coverLetter(p.getCoverLetter())
                .proposedAmount(p.getProposedAmount())
                .estimatedDays(p.getEstimatedDays())
                .status(p.getStatus())
                .submittedAt(p.getSubmittedAt())
                .job(jobDto)
                .freelancer(userDto)
                .build();
    }

    /** Apply values from this DTO onto an existing Proposal model instance */
    public void applyToModel(Proposal p) {
        if (p == null) return;
        if (this.coverLetter != null) p.setCoverLetter(this.coverLetter);
        if (this.proposedAmount != null) p.setProposedAmount(this.proposedAmount);
        if (this.estimatedDays != null) p.setEstimatedDays(this.estimatedDays);
        if (this.status != null) p.setStatus(this.status);
        if (this.submittedAt != null) p.setSubmittedAt(this.submittedAt);
    }
}