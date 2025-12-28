package com.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Request payload for creating or searching jobs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private JobCategory category;

    @DecimalMin(value = "0.00", message = "budgetFrom must be non-negative")
    private BigDecimal budgetFrom;

    @DecimalMin(value = "0.00", message = "budgetTo must be non-negative")
    private BigDecimal budgetTo;

    @PositiveOrZero(message = "deadlineDays must be zero or positive")
    private Integer deadlineDays;

    @AssertTrue(message = "budgetFrom must be less than or equal to budgetTo when both provided")
    public boolean isBudgetRangeValid() {
        if (budgetFrom == null || budgetTo == null) return true;
        return budgetFrom.compareTo(budgetTo) <= 0;
    }

    /**
     * Map this request to a JobDTO. The chosen budget will prefer `budgetTo` if provided,
     * otherwise `budgetFrom` is used. Deadline is calculated from `deadlineDays` if present.
     */
    public JobDTO toJobDTO() {
        JobDTO.JobDTOBuilder builder = JobDTO.builder()
                .title(this.title)
                .description(this.description)
                .category(this.category)
                .budget(this.budgetTo != null ? this.budgetTo : this.budgetFrom);

        if (this.deadlineDays != null) {
            LocalDateTime deadline = LocalDateTime.now().plusDays(this.deadlineDays);
            builder.deadline(deadline);
        }

        JobDTO dto = builder.build();
        dto.touchCreated();
        return dto;
    }
}