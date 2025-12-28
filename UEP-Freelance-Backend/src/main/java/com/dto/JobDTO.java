package com.dto;

import com.model.JobStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for job payloads.
 * Includes validation annotations and JSON formatting for dates.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Budget must be a positive amount")
    private BigDecimal budget;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deadline;

    private JobStatus status;

    @NotNull(message = "Category is required")
    private JobCategory category;

    /**
     * Optional metadata: when the job was created (epoch ms)
     */
    private Long createdAt;

    /**
     * Optional metadata: when the job was last updated (epoch ms)
     */
    private Long updatedAt;

    /**
     * Convenience method to set timestamps when creating from service layer.
     */
    public void touchCreated() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        }
        this.updatedAt = LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
    }
}