class UEPFreelanceApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadPage('home');
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.loadPage(page);
                this.closeMobileMenu();
            });
        });

        // Auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('registerBtn').addEventListener('click', () => this.showRegisterModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showRegisterModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Mobile menu toggle
        document.getElementById('navToggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.remove('active');
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData && userData.token) {
                    this.currentUser = userData;
                    this.updateUIForAuth();
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    updateUIForAuth() {
        document.getElementById('navAuth').style.display = 'none';
        document.getElementById('navUser').style.display = 'flex';
        document.getElementById('userName').textContent = this.currentUser.firstName;
        document.getElementById('userNameMenu').textContent = this.currentUser.firstName;
        
        // Update navigation based on user role
        this.updateNavigationForRole();
    }

    updateNavigationForRole() {
        const postJobLink = document.querySelector('a[href="#post-job"]');
        if (this.currentUser.role === 'STUDENT') {
            if (postJobLink) postJobLink.style.display = 'none';
        } else if (this.currentUser.role === 'CLIENT') {
            // Clients can post jobs
            if (postJobLink) postJobLink.style.display = 'block';
        }
    }

    updateUIForLogout() {
        document.getElementById('navAuth').style.display = 'flex';
        document.getElementById('navUser').style.display = 'none';
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showRegisterModal() {
        this.showModal('registerModal');
    }

    showJobModal() {
        this.showModal('jobModal');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data));
                this.currentUser = data;
                this.updateUIForAuth();
                this.hideModal('loginModal');
                this.showAlert('Login successful! Welcome back!', 'success');
                this.loadPage('dashboard');
                document.getElementById('loginForm').reset();
            } else {
                const error = await response.text();
                this.showAlert(error || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed. Please check your internet connection.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = {
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            firstName: document.getElementById('regFirstName').value,
            lastName: document.getElementById('regLastName').value,
            role: document.getElementById('regRole').value
        };

        // Validate UEP email
        if (!formData.email.toLowerCase().endsWith('@uep.edu.ph')) {
            this.showAlert('Please use a valid UEP email address (@uep.edu.ph)', 'error');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                this.hideModal('registerModal');
                this.showAlert(data.message || 'Registration successful! Please check your email for verification.', 'success');
                document.getElementById('registerForm').reset();
            } else {
                const error = await response.text();
                this.showAlert(error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('Registration failed. Please check your internet connection.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    logout() {
        this.updateUIForLogout();
        this.loadPage('home');
        this.showAlert('Logged out successfully', 'success');
    }

    async loadPage(page) {
        this.currentPage = page;
        const app = document.getElementById('app');
        
        // Show loading
        this.showLoading();

        try {
            let html = '';
            
            switch(page) {
                case 'home':
                    html = this.renderHomePage();
                    break;
                case 'jobs':
                    html = this.renderJobsPage();
                    break;
                case 'post-job':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderPostJobPage();
                    break;
                case 'dashboard':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderDashboard();
                    await this.loadDashboardData();
                    break;
                case 'freelancers':
                    html = this.renderFreelancersPage();
                    await this.loadFreelancers();
                    break;
                case 'profile':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderProfilePage();
                    break;
                default:
                    html = this.renderHomePage();
            }

            app.innerHTML = html;
            app.classList.add('page-transition');

            // Update active nav link
            this.updateActiveNavLink(page);

        } catch (error) {
            console.error('Error loading page:', error);
            this.showAlert('Error loading page. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    updateActiveNavLink(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });
    }

    renderHomePage() {
        return `
            <section class="hero">
                <div class="hero-content">
                    <h1>UEP Student Freelance Network</h1>
                    <p>Connect with talented UEP student freelancers and find amazing opportunities in a secure, university-supported environment. Build your career while you study!</p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="app.loadPage('jobs')">
                            <i class="fas fa-search"></i> Find Work
                        </button>
                        <button class="btn-secondary" onclick="app.loadPage('post-job')">
                            <i class="fas fa-briefcase"></i> Post a Job
                        </button>
                        <button class="btn-secondary" onclick="app.loadPage('freelancers')">
                            <i class="fas fa-users"></i> Find Talent
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="features">
                <div class="container">
                    <h2>Why Choose UEP Freelance?</h2>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <i class="fas fa-shield-alt"></i>
                            <h3>Secure Payments</h3>
                            <p>Escrow system protects both freelancers and clients with secure payment holding until work is completed satisfactorily.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-university"></i>
                            <h3>UEP Verified</h3>
                            <p>All users verified with UEP email addresses ensuring a trusted community of students and clients.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-hands-helping"></i>
                            <h3>Mentorship Program</h3>
                            <p>Get guidance from experienced freelancers and build your skills through our mentorship program.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-briefcase"></i>
                            <h3>Career Opportunities</h3>
                            <p>Build your portfolio and gain real-world experience while studying. Perfect for launching your career.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="stats" style="background: var(--primary-color); color: white; padding: 6rem 2rem; text-align: center;">
                <div class="container">
                    <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Platform Statistics</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-top: 2rem;">
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">78%</h3>
                            <p style="font-size: 1.2rem;">UEP Students with Marketable Skills</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">100%</h3>
                            <p style="font-size: 1.2rem;">Verified UEP Community</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">Secure</h3>
                            <p style="font-size: 1.2rem;">Escrow Payment Protection</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">24/7</h3>
                            <p style="font-size: 1.2rem;">Platform Support</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style="padding: 6rem 2rem; background: var(--white);">
                <div class="container text-center">
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Ready to Get Started?</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem; color: var(--text-light);">
                        Join hundreds of UEP students and clients already using our platform
                    </p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="app.showRegisterModal()">
                            <i class="fas fa-user-plus"></i> Sign Up Now
                        </button>
                        <button class="btn-secondary" onclick="app.loadPage('jobs')">
                            <i class="fas fa-eye"></i> Browse Jobs
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    renderJobsPage() {
        return `
            <section class="jobs-section">
                <div class="container">
                    <h1>Find Freelance Work</h1>
                    <p>Browse available jobs posted by clients and start earning while you study</p>
                    
                    <div class="filters">
                        <input type="text" id="searchJobs" placeholder="Search jobs by title or description...">
                        <select id="categoryFilter">
                            <option value="">All Categories</option>
                            <option value="GRAPHIC_DESIGN">Graphic Design</option>
                            <option value="VIDEO_EDITING">Video Editing</option>
                            <option value="PROGRAMMING">Programming</option>
                            <option value="DIGITAL_ART">Digital Art</option>
                            <option value="WRITING">Writing</option>
                            <option value="DATA_ENTRY">Data Entry</option>
                            <option value="RESEARCH">Research</option>
                            <option value="TUTORING">Tutoring</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <select id="sortFilter">
                            <option value="newest">Newest First</option>
                            <option value="budget_high">Budget: High to Low</option>
                            <option value="budget_low">Budget: Low to High</option>
                            <option value="deadline">Deadline</option>
                        </select>
                        <button class="btn-primary" onclick="app.loadJobs()">
                            <i class="fas fa-filter"></i> Apply Filters
                        </button>
                        ${this.currentUser && this.currentUser.role === 'STUDENT' ? `
                            <button class="btn-secondary" onclick="app.loadPage('dashboard')">
                                <i class="fas fa-chart-line"></i> My Dashboard
                            </button>
                        ` : ''}
                    </div>
                    
                    <div id="jobsList" class="jobs-grid">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Loading available jobs...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async loadJobs() {
        const jobsList = document.getElementById('jobsList');
        if (!jobsList) return;

        jobsList.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading available jobs...</p>
            </div>
        `;

        try {
            const response = await fetch(`${this.apiBaseUrl}/jobs`);
            if (response.ok) {
                const jobs = await response.json();
                this.renderJobs(jobs);
            } else {
                throw new Error('Failed to load jobs');
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            jobsList.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    Error loading jobs: ${error.message}
                </div>
            `;
        }
    }

    renderJobs(jobs) {
        const jobsList = document.getElementById('jobsList');
        if (!jobsList) return;
        
        if (jobs.length === 0) {
            jobsList.innerHTML = `
                <div class="alert alert-warning" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No jobs found matching your criteria. Check back later or try different filters.
                </div>
            `;
            return;
        }

        jobsList.innerHTML = jobs.map(job => `
            <div class="job-card" onclick="app.viewJob(${job.id})">
                <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                    ${job.status.replace('_', ' ')}
                </div>
                <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
                <div class="job-budget">₱${job.budget?.toLocaleString() || '0'}</div>
                <p class="job-description">${this.escapeHtml(job.description?.substring(0, 150) || 'No description provided')}...</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="category-tag">${this.formatCategory(job.category)}</span>
                    <span class="deadline">
                        <i class="fas fa-clock"></i> 
                        Due: ${new Date(job.deadline).toLocaleDateString()}
                    </span>
                </div>
                <div class="job-meta">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-calendar"></i>
                        Posted: ${new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <button class="btn-primary" onclick="event.stopPropagation(); app.viewJob(${job.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    async viewJob(jobId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}`);
            if (response.ok) {
                const job = await response.json();
                this.showJobDetails(job);
            } else {
                throw new Error('Failed to load job details');
            }
        } catch (error) {
            console.error('Error loading job details:', error);
            this.showAlert('Error loading job details', 'error');
        }
    }

    showJobDetails(job) {
        const modalContent = document.getElementById('jobModalContent');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <div class="job-details">
                <div class="job-details-header">
                    <div>
                        <h1 class="job-details-title">${this.escapeHtml(job.title)}</h1>
                        <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                            ${job.status.replace('_', ' ')}
                        </div>
                    </div>
                    <div class="job-details-budget">₱${job.budget?.toLocaleString() || '0'}</div>
                </div>

                <div class="job-details-meta">
                    <span class="category-tag">${this.formatCategory(job.category)}</span>
                    <span style="color: var(--text-light);">
                        <i class="fas fa-clock"></i> 
                        Deadline: ${new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <span style="color: var(--text-light);">
                        <i class="fas fa-user"></i> 
                        Client: ${this.escapeHtml(job.client?.firstName + ' ' + job.client?.lastName)}
                    </span>
                </div>

                <div class="job-details-description">
                    <h3>Job Description</h3>
                    <p>${this.escapeHtml(job.description || 'No description provided.')}</p>
                </div>

                ${this.currentUser && this.currentUser.role === 'STUDENT' ? `
                    <div class="job-details-actions">
                        <button class="btn-primary" onclick="app.submitProposal(${job.id})">
                            <i class="fas fa-paper-plane"></i> Submit Proposal
                        </button>
                        <button class="btn-secondary" onclick="app.hideModal('jobModal')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                ` : `
                    <div class="job-details-actions">
                        <button class="btn-secondary" onclick="app.hideModal('jobModal')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                `}
            </div>
        `;

        this.showJobModal();
    }

    async submitProposal(jobId) {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }

        const coverLetter = prompt('Enter your proposal cover letter:');
        if (!coverLetter) return;

        const proposedAmount = prompt('Enter your proposed amount (₱):');
        if (!proposedAmount || isNaN(proposedAmount)) {
            this.showAlert('Please enter a valid amount', 'error');
            return;
        }

        const estimatedDays = prompt('Enter estimated days to complete:');
        if (!estimatedDays || isNaN(estimatedDays)) {
            this.showAlert('Please enter a valid number of days', 'error');
            return;
        }

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
                    proposedAmount: parseFloat(proposedAmount),
                    estimatedDays: parseInt(estimatedDays)
                })
            });

            if (response.ok) {
                this.hideModal('jobModal');
                this.showAlert('Proposal submitted successfully!', 'success');
            } else {
                const error = await response.text();
                this.showAlert(error || 'Failed to submit proposal', 'error');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            this.showAlert('Error submitting proposal', 'error');
        }
    }

    renderPostJobPage() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        return `
            <section class="container">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1>Post a New Job</h1>
                    <p>Fill out the form below to post a new job opportunity for UEP students</p>
                    
                    <form id="postJobForm" onsubmit="app.handlePostJob(event)" style="background: var(--white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <div class="form-group">
                            <label for="jobTitle">Job Title *</label>
                            <input type="text" id="jobTitle" required placeholder="e.g., Website Design for Small Business">
                        </div>
                        
                        <div class="form-group">
                            <label for="jobCategory">Category *</label>
                            <select id="jobCategory" required>
                                <option value="">Select Category</option>
                                <option value="GRAPHIC_DESIGN">Graphic Design</option>
                                <option value="VIDEO_EDITING">Video Editing</option>
                                <option value="PROGRAMMING">Programming</option>
                                <option value="DIGITAL_ART">Digital Art</option>
                                <option value="WRITING">Writing</option>
                                <option value="DATA_ENTRY">Data Entry</option>
                                <option value="RESEARCH">Research</option>
                                <option value="TUTORING">Tutoring</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="jobDescription">Description *</label>
                            <textarea id="jobDescription" rows="8" required placeholder="Describe the job requirements, deliverables, and any specific skills needed..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="jobBudget">Budget (₱) *</label>
                                <input type="number" id="jobBudget" required min="100" step="50" placeholder="1000">
                            </div>
                            
                            <div class="form-group">
                                <label for="jobDeadline">Deadline *</label>
                                <input type="date" id="jobDeadline" required min="${minDate}">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-primary btn-full">
                            <i class="fas fa-paper-plane"></i> Post Job
                        </button>
                    </form>
                </div>
            </section>
        `;
    }

    async handlePostJob(e) {
        e.preventDefault();
        
        const jobData = {
            title: document.getElementById('jobTitle').value,
            description: document.getElementById('jobDescription').value,
            budget: parseFloat(document.getElementById('jobBudget').value),
            deadline: document.getElementById('jobDeadline').value + 'T23:59:59',
            category: document.getElementById('jobCategory').value
        };

        // Validation
        if (jobData.budget < 100) {
            this.showAlert('Budget must be at least ₱100', 'error');
            return;
        }

        this.showLoading();

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
                const job = await response.json();
                this.showAlert('Job posted successfully!', 'success');
                document.getElementById('postJobForm').reset();
                this.loadPage('jobs');
            } else {
                const error = await response.text();
                this.showAlert(error || 'Failed to post job', 'error');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            this.showAlert('Failed to post job. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderDashboard() {
        const isStudent = this.currentUser?.role === 'STUDENT';
        const isClient = this.currentUser?.role === 'CLIENT';
        
        return `
            <section class="dashboard">
                <div class="container">
                    <h1>Welcome back, ${this.currentUser?.firstName}!</h1>
                    <p>Here's your freelancing dashboard at a glance</p>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-card">
                            <h3>Active Jobs</h3>
                            <div class="value" id="activeJobs">0</div>
                        </div>
                        <div class="dashboard-card">
                            <h3>Completed Jobs</h3>
                            <div class="value" id="completedJobs">0</div>
                        </div>
                        <div class="dashboard-card">
                            <h3>Total Earnings</h3>
                            <div class="value" id="totalEarnings">₱0</div>
                        </div>
                        <div class="dashboard-card">
                            <h3>Your Rating</h3>
                            <div class="value" id="userRating">0.0</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-actions">
                        <div>
                            <h3>Recent Activity</h3>
                            <div id="recentActivity" style="min-height: 200px;">
                                <div class="loading-spinner">
                                    <div class="spinner"></div>
                                    <p>Loading activity...</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3>Quick Actions</h3>
                            <div class="quick-actions">
                                ${isStudent ? `
                                    <button class="btn-primary" onclick="app.loadPage('jobs')">
                                        <i class="fas fa-search"></i> Browse Jobs
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('profile')">
                                        <i class="fas fa-user-edit"></i> Update Profile
                                    </button>
                                    <button class="btn-secondary" onclick="app.viewMyProposals()">
                                        <i class="fas fa-list"></i> View Proposals
                                    </button>
                                ` : ''}
                                ${isClient ? `
                                    <button class="btn-primary" onclick="app.loadPage('post-job')">
                                        <i class="fas fa-plus"></i> Post New Job
                                    </button>
                                    <button class="btn-secondary" onclick="app.viewMyJobs()">
                                        <i class="fas fa-briefcase"></i> Manage Jobs
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('freelancers')">
                                        <i class="fas fa-users"></i> View Freelancers
                                    </button>
                                ` : ''}
                                <button class="btn-secondary" onclick="app.loadPage('profile')">
                                    <i class="fas fa-cog"></i> Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async loadDashboardData() {
        // Mock data for demonstration - in real app, you'd fetch from API
        setTimeout(() => {
            document.getElementById('activeJobs').textContent = '3';
            document.getElementById('completedJobs').textContent = '12';
            document.getElementById('totalEarnings').textContent = '₱25,400';
            document.getElementById('userRating').textContent = '4.8';
            
            const activity = document.getElementById('recentActivity');
            if (activity) {
                activity.innerHTML = `
                    <div style="padding: 1rem 0; border-bottom: 1px solid var(--gray-light);">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                            <strong style="flex: 1;">New proposal received for "Website Redesign"</strong>
                            <span style="color: var(--success); font-size: 0.9rem;">₱5,000</span>
                        </div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> 2 hours ago
                        </div>
                    </div>
                    <div style="padding: 1rem 0; border-bottom: 1px solid var(--gray-light);">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                            <strong style="flex: 1;">Payment released for "Logo Design"</strong>
                            <span style="color: var(--success); font-size: 0.9rem;">₱2,500</span>
                        </div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> 1 day ago
                        </div>
                    </div>
                    <div style="padding: 1rem 0;">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
                            <strong style="flex: 1;">Job "Social Media Graphics" completed</strong>
                            <span style="color: var(--success); font-size: 0.9rem;">₱1,800</span>
                        </div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> 3 days ago
                        </div>
                    </div>
                `;
            }
        }, 1000);
    }

    renderFreelancersPage() {
        return `
            <section class="container">
                <h1>Find UEP Student Freelancers</h1>
                <p>Browse talented UEP students ready to work on your projects</p>
                
                <div class="filters">
                    <input type="text" id="searchFreelancers" placeholder="Search by skills or name...">
                    <select id="skillFilter">
                        <option value="">All Skills</option>
                        <option value="design">Graphic Design</option>
                        <option value="programming">Programming</option>
                        <option value="video">Video Editing</option>
                        <option value="writing">Writing</option>
                        <option value="research">Research</option>
                    </select>
                    <select id="ratingFilter">
                        <option value="">Any Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                    </select>
                    <button class="btn-primary" onclick="app.loadFreelancers()">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
                
                <div id="freelancersList" class="jobs-grid">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading freelancers...</p>
                    </div>
                </div>
            </section>
        `;
    }

    async loadFreelancers() {
        // Mock freelancers data - in real app, you'd fetch from API
        const freelancers = [
            {
                id: 1,
                name: 'Juan Dela Cruz',
                skills: 'Graphic Design, Digital Art, UI/UX Design',
                rating: 4.8,
                hourlyRate: 250,
                completedJobs: 15,
                bio: 'Creative graphic designer with 3 years of experience in branding and digital design.'
            },
            {
                id: 2,
                name: 'Maria Santos',
                skills: 'Video Editing, Animation, Motion Graphics',
                rating: 4.9,
                hourlyRate: 300,
                completedJobs: 22,
                bio: 'Professional video editor specializing in corporate videos and social media content.'
            },
            {
                id: 3,
                name: 'Carlos Reyes',
                skills: 'Web Development, JavaScript, React, Node.js',
                rating: 4.7,
                hourlyRate: 350,
                completedJobs: 18,
                bio: 'Full-stack developer passionate about creating responsive and user-friendly web applications.'
            },
            {
                id: 4,
                name: 'Anna Lopez',
                skills: 'Content Writing, Copywriting, SEO',
                rating: 4.6,
                hourlyRate: 200,
                completedJobs: 25,
                bio: 'Versatile writer with expertise in blog posts, product descriptions, and SEO content.'
            }
        ];

        const freelancersList = document.getElementById('freelancersList');
        if (!freelancersList) return;

        freelancersList.innerHTML = freelancers.map(freelancer => `
            <div class="job-card">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="width: 60px; height: 60px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                        ${freelancer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 class="job-title">${freelancer.name}</h3>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: gold;">⭐ ${freelancer.rating}</span>
                            <span style="color: var(--text-light); font-size: 0.9rem;">
                                ${freelancer.completedJobs} jobs completed
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="job-budget">₱${freelancer.hourlyRate}/hour</div>
                
                <p style="color: var(--text-light); margin-bottom: 1rem; line-height: 1.5;">
                    <strong>Skills:</strong> ${freelancer.skills}
                </p>
                
                <p style="color: var(--text-light); margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.4;">
                    ${freelancer.bio}
                </p>
                
                <div class="job-meta">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-star"></i> ${freelancer.rating}/5.0
                    </span>
                    <button class="btn-primary" style="font-size: 0.9rem;">
                        View Profile
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderProfilePage() {
        return `
            <section class="container">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1>My Profile</h1>
                    <p>Manage your account settings and profile information</p>
                    
                    <div style="background: var(--white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-light);">
                            <div style="width: 100px; height: 100px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem;">
                                ${this.currentUser?.firstName?.[0]}${this.currentUser?.lastName?.[0]}
                            </div>
                            <div>
                                <h2 style="margin-bottom: 0.5rem;">${this.currentUser?.firstName} ${this.currentUser?.lastName}</h2>
                                <p style="color: var(--text-light); margin-bottom: 0.5rem;">${this.currentUser?.email}</p>
                                <span class="category-tag" style="text-transform: capitalize;">${this.currentUser?.role?.toLowerCase()}</span>
                            </div>
                        </div>
                        
                        <form id="profileForm" onsubmit="app.handleProfileUpdate(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profileFirstName">First Name</label>
                                    <input type="text" id="profileFirstName" value="${this.currentUser?.firstName || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="profileLastName">Last Name</label>
                                    <input type="text" id="profileLastName" value="${this.currentUser?.lastName || ''}" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="profileEmail">Email</label>
                                <input type="email" id="profileEmail" value="${this.currentUser?.email || ''}" disabled>
                                <small>Email cannot be changed. Contact support if needed.</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="profilePhone">Phone Number</label>
                                <input type="tel" id="profilePhone" placeholder="+63 912 345 6789">
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        `;
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        // Profile update logic would go here
        this.showAlert('Profile updated successfully!', 'success');
    }

    viewMyProposals() {
        this.showAlert('This feature is coming soon!', 'info');
    }

    viewMyJobs() {
        this.showAlert('This feature is coming soon!', 'info');
    }

    // Utility methods
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'flex';
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatCategory(category) {
        if (!category) return 'Other';
        return category.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // You can register a service worker here for offline functionality
                console.log('Service Worker support detected');
            });
        }
    }

    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }
}

// Initialize the application
const app = new UEPFreelanceApp();

// Make app globally available for onclick handlers
window.app = app;