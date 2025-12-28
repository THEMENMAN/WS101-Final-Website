class JobsManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.mockJobs = this.getMockJobs();
    }

    getMockJobs() {
        return [
            {
                id: 1,
                title: 'Website Design for UEP Library',
                description: 'Design a modern, responsive website for the UEP Library system. Should include book search, reservation system, and admin panel.',
                budget: 15000,
                deadline: '2024-12-31',
                category: 'WEB_DEVELOPMENT',
                status: 'OPEN',
                client: {
                    firstName: 'Client',
                    lastName: 'User',
                    email: 'client@uep.edu.ph'
                },
                createdAt: '2024-01-15',
                proposals: []
            },
            {
                id: 2,
                title: 'Mobile App UI/UX Design',
                description: 'Design intuitive UI/UX for a student productivity mobile application. Must follow Material Design guidelines.',
                budget: 8000,
                deadline: '2024-12-20',
                category: 'UI_UX_DESIGN',
                status: 'OPEN',
                client: {
                    firstName: 'Client',
                    lastName: 'User',
                    email: 'client@uep.edu.ph'
                },
                createdAt: '2024-01-10',
                proposals: []
            },
            {
                id: 3,
                title: 'Data Analysis Project',
                description: 'Analyze student performance data and create visualizations using Python and Tableau.',
                budget: 12000,
                deadline: '2024-12-25',
                category: 'DATA_SCIENCE',
                status: 'IN_PROGRESS',
                client: {
                    firstName: 'Client',
                    lastName: 'User',
                    email: 'client@uep.edu.ph'
                },
                createdAt: '2024-01-05',
                proposals: []
            }
        ];
    }

    async getOpenJobs(filters = {}) {
        try {
            // Try API first
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
            throw new Error('API not available');
        } catch (error) {
            console.warn('API unavailable, using mock data:', error.message);
            
            // Return filtered mock data
            let filteredJobs = this.mockJobs;
            
            if (filters.category) {
                filteredJobs = filteredJobs.filter(job => job.category === filters.category);
            }
            
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredJobs = filteredJobs.filter(job => 
                    job.title.toLowerCase().includes(searchTerm) || 
                    job.description.toLowerCase().includes(searchTerm)
                );
            }
            
            return filteredJobs;
        }
    }

    async getJobDetails(jobId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('API not available');
        } catch (error) {
            console.warn('API unavailable, using mock data:', error.message);
            return this.mockJobs.find(job => job.id === jobId) || null;
        }
    }

    // ... rest of the methods remain the same, but add try-catch for API fallbacks
}