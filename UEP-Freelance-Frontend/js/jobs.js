class JobsManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
    }

    async getOpenJobs(filters = {}) {
        try {
            let url = `${this.apiBaseUrl}/jobs`;
            const queryParams = new URLSearchParams();
            
            if (filters.category) {
                queryParams.append('category', filters.category);
            }
            if (filters.search) {
                queryParams.append('search', filters.search);
            }

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch jobs');
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    async getJobDetails(jobId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch job details');
        } catch (error) {
            console.error('Error fetching job details:', error);
            throw error;
        }
    }

    async submitProposal(jobId, coverLetter, proposedAmount, estimatedDays) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}/proposals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    coverLetter,
                    proposedAmount,
                    estimatedDays
                })
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to submit proposal');
        } catch (error) {
            console.error('Error submitting proposal:', error);
            throw error;
        }
    }

    async getMyJobs() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/jobs/my-jobs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch user jobs');
        } catch (error) {
            console.error('Error fetching user jobs:', error);
            throw error;
        }
    }

    async createJob(jobData) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to create job');
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }

    async getJobProposals(jobId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}/proposals`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch job proposals');
        } catch (error) {
            console.error('Error fetching job proposals:', error);
            throw error;
        }
    }

    async acceptProposal(proposalId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/jobs/proposals/${proposalId}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to accept proposal');
        } catch (error) {
            console.error('Error accepting proposal:', error);
            throw error;
        }
    }

    validateJobData(jobData) {
        const errors = [];

        if (!jobData.title || jobData.title.trim().length < 5) {
            errors.push('Job title must be at least 5 characters long');
        }

        if (!jobData.description || jobData.description.trim().length < 20) {
            errors.push('Job description must be at least 20 characters long');
        }

        if (!jobData.budget || jobData.budget < 100) {
            errors.push('Budget must be at least ₱100');
        }

        if (!jobData.deadline) {
            errors.push('Deadline is required');
        } else {
            const deadline = new Date(jobData.deadline);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (deadline < tomorrow) {
                errors.push('Deadline must be at least 1 day from now');
            }
        }

        if (!jobData.category) {
            errors.push('Category is required');
        }

        return errors;
    }

    formatJobForDisplay(job) {
        return {
            ...job,
            formattedBudget: `₱${job.budget?.toLocaleString() || '0'}`,
            formattedDeadline: new Date(job.deadline).toLocaleDateString(),
            formattedCreatedAt: new Date(job.createdAt).toLocaleDateString(),
            statusClass: `status-${job.status?.toLowerCase().replace('_', '-')}`,
            displayCategory: this.formatCategory(job.category)
        };
    }

    formatCategory(category) {
        if (!category) return 'Other';
        return category.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Create global jobs manager instance
const jobsManager = new JobsManager();