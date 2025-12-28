/* UEP Student Freelance Network - Complete Frontend Application */
class UEPFreelanceApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.demoAccounts = {
            'admin@uep.edu.ph': { 
                firstName: 'Admin', 
                lastName: 'User', 
                role: 'ADMIN', 
                email: 'admin@uep.edu.ph', 
                password: 'password123' 
            },
            'client@uep.edu.ph': { 
                firstName: 'Client', 
                lastName: 'User', 
                role: 'CLIENT', 
                email: 'client@uep.edu.ph', 
                password: 'password123' 
            },
            'student@uep.edu.ph': { 
                firstName: 'Student', 
                lastName: 'User', 
                role: 'STUDENT', 
                email: 'student@uep.edu.ph', 
                password: 'password123' 
            }
        };
        this.jobs = [];
        this.proposals = [];
        this.messages = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.loadPage('home');
        this.updateAuthUI();
    }

    loadFromStorage() {
        // Load user
        const userData = localStorage.getItem('uep_currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }

        // Load jobs
        const jobsData = localStorage.getItem('uep_jobs');
        if (jobsData) {
            this.jobs = JSON.parse(jobsData);
        } else {
            // Initialize with sample jobs
            this.jobs = [
                {
                    id: 1,
                    title: 'Website Design for UEP Library',
                    description: 'Design a modern, responsive website for the UEP Library system. Should include book search, reservation system, and admin panel.',
                    budget: 15000,
                    deadline: '2024-12-31',
                    category: 'WEB_DEVELOPMENT',
                    status: 'OPEN',
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
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
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
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
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
                    createdAt: '2024-01-05',
                    proposals: []
                },
                {
                    id: 4,
                    title: 'Social Media Content Creation',
                    description: 'Create engaging social media content for UEP student organizations. 10 posts per week for 1 month.',
                    budget: 5000,
                    deadline: '2024-12-15',
                    category: 'CONTENT_CREATION',
                    status: 'OPEN',
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
                    createdAt: '2024-01-12',
                    proposals: []
                },
                {
                    id: 5,
                    title: 'Python Programming Tutor',
                    description: 'Tutor a first-year CS student in Python programming basics. 2 hours per week for 8 weeks.',
                    budget: 4000,
                    deadline: '2024-12-30',
                    category: 'TUTORING',
                    status: 'OPEN',
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
                    createdAt: '2024-01-08',
                    proposals: []
                },
                {
                    id: 6,
                    title: 'Logo Design for Coding Club',
                    description: 'Design a modern logo for UEP Coding Club. Should represent programming and innovation.',
                    budget: 3000,
                    deadline: '2024-12-18',
                    category: 'GRAPHIC_DESIGN',
                    status: 'COMPLETED',
                    clientId: 'client@uep.edu.ph',
                    clientName: 'Client User',
                    createdAt: '2024-01-03',
                    proposals: []
                }
            ];
            this.saveToStorage('uep_jobs', this.jobs);
        }

        // Load proposals
        const proposalsData = localStorage.getItem('uep_proposals');
        if (proposalsData) {
            this.proposals = JSON.parse(proposalsData);
        }

        // Load messages
        const messagesData = localStorage.getItem('uep_messages');
        if (messagesData) {
            this.messages = JSON.parse(messagesData);
        }
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href')?.substring(1) || 
                            e.target.closest('[data-page]')?.getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                    this.closeMobileMenu();
                }
            });
        });

        // Footer links
        document.querySelectorAll('.footer-section a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.loadPage(page);
                }
            });
        });

        // Auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('registerBtn').addEventListener('click', () => this.showRegisterModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Modal buttons
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

        // User dropdown toggle
        document.getElementById('userMenu').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('dropdownMenu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
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

    // Authentication Methods
    fillDemoAccount(email) {
        const account = this.demoAccounts[email];
        if (account) {
            document.getElementById('loginEmail').value = account.email;
            document.getElementById('loginPassword').value = account.password;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        this.showLoading();

        try {
            // Check demo accounts
            if (this.demoAccounts[email] && this.demoAccounts[email].password === password) {
                const account = this.demoAccounts[email];
                this.currentUser = {
                    firstName: account.firstName,
                    lastName: account.lastName,
                    email: account.email,
                    role: account.role,
                    phone: '+63 912 345 6789',
                    bio: `${account.role} at UEP Freelance Network`,
                    skills: account.role === 'STUDENT' ? ['Web Development', 'Design', 'Programming'] : [],
                    rating: 4.8,
                    completedJobs: account.role === 'STUDENT' ? 15 : 0
                };
                
                this.saveToStorage('uep_currentUser', this.currentUser);
                this.hideModal('loginModal');
                this.updateAuthUI();
                this.showAlert('Login successful! Welcome back!', 'success');
                this.loadPage('dashboard');
                document.getElementById('loginForm').reset();
            } else {
                this.showAlert('Invalid credentials. Please try demo accounts.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed. Please check your credentials.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = {
            firstName: document.getElementById('regFirstName').value,
            lastName: document.getElementById('regLastName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            phone: document.getElementById('regPhone').value,
            role: document.getElementById('regRole').value
        };

        // Validate UEP email
        if (!formData.email.toLowerCase().endsWith('@uep.edu.ph')) {
            this.showAlert('Please use a valid UEP email address (@uep.edu.ph)', 'error');
            return;
        }

        this.showLoading();

        try {
            // Check if email already exists
            if (this.demoAccounts[formData.email]) {
                this.showAlert('Email already registered. Please use a different email or login.', 'error');
                return;
            }

            // Create new account
            this.demoAccounts[formData.email] = {
                ...formData,
                password: formData.password
            };

            this.currentUser = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                phone: formData.phone,
                bio: `New ${formData.role.toLowerCase()} at UEP`,
                skills: formData.role === 'STUDENT' ? [] : [],
                rating: 0,
                completedJobs: 0
            };

            this.saveToStorage('uep_currentUser', this.currentUser);
            this.hideModal('registerModal');
            this.updateAuthUI();
            this.showAlert('Registration successful! Welcome to UEP Freelance!', 'success');
            this.loadPage('dashboard');
            document.getElementById('registerForm').reset();
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('Registration failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('uep_currentUser');
        this.updateAuthUI();
        this.loadPage('home');
        this.showAlert('Logged out successfully', 'success');
    }

    updateAuthUI() {
        if (this.currentUser) {
            document.getElementById('navAuth').style.display = 'none';
            document.getElementById('navUser').style.display = 'flex';
            document.getElementById('userNameMenu').textContent = this.currentUser.firstName;
            
            // Show/hide links based on role
            const postJobLink = document.getElementById('postJobLink');
            const adminLink = document.getElementById('adminLink');
            
            if (this.currentUser.role === 'CLIENT' || this.currentUser.role === 'ADMIN') {
                postJobLink.style.display = 'block';
            } else {
                postJobLink.style.display = 'none';
            }
            
            if (this.currentUser.role === 'ADMIN') {
                adminLink.style.display = 'block';
            } else {
                adminLink.style.display = 'none';
            }
        } else {
            document.getElementById('navAuth').style.display = 'flex';
            document.getElementById('navUser').style.display = 'none';
        }
    }

    // Page Loading Methods
    loadPage(page) {
        this.currentPage = page;
        const app = document.getElementById('app');
        
        this.showLoading();

        try {
            let html = '';
            
            switch(page) {
                case 'home':
                    html = this.renderHomePage();
                    break;
                case 'jobs':
                    html = this.renderJobsPage();
                    setTimeout(() => this.loadJobs(), 100);
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
                    setTimeout(() => this.loadDashboardData(), 100);
                    break;
                case 'freelancers':
                    html = this.renderFreelancersPage();
                    setTimeout(() => this.loadFreelancers(), 100);
                    break;
                case 'profile':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderProfilePage();
                    break;
                case 'my-jobs':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderMyJobsPage();
                    setTimeout(() => this.loadMyJobs(), 100);
                    break;
                case 'my-proposals':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderMyProposalsPage();
                    setTimeout(() => this.loadMyProposals(), 100);
                    break;
                case 'messages':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderMessagesPage();
                    setTimeout(() => this.loadMessages(), 100);
                    break;
                case 'settings':
                    if (!this.currentUser) {
                        this.showLoginModal();
                        return;
                    }
                    html = this.renderSettingsPage();
                    break;
                case 'admin-dashboard':
                    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
                        this.showAlert('Access denied. Admin only.', 'error');
                        this.loadPage('home');
                        return;
                    }
                    html = this.renderAdminDashboard();
                    setTimeout(() => this.loadAdminData(), 100);
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
            if (link.getAttribute('href') === `#${page}` || link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }

    // Render Methods
    renderHomePage() {
        return `
            <section class="hero">
                <div class="hero-content">
                    <h1>UEP Student Freelance Network</h1>
                    <p>Connect with talented UEP student freelancers and find amazing opportunities in a secure, university-supported environment. Build your career while you study!</p>
                    <div class="hero-buttons">
                        ${!this.currentUser ? `
                            <button class="btn-primary" onclick="app.showRegisterModal()">
                                <i class="fas fa-user-plus"></i> Join Now
                            </button>
                        ` : ''}
                        <button class="btn-secondary" onclick="app.loadPage('jobs')">
                            <i class="fas fa-search"></i> Find Work
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
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">${this.jobs.length}+</h3>
                            <p style="font-size: 1.2rem;">Active Jobs</p>
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
                        ${!this.currentUser ? `
                            <button class="btn-primary" onclick="app.showRegisterModal()">
                                <i class="fas fa-user-plus"></i> Sign Up Now
                            </button>
                        ` : `
                            <button class="btn-primary" onclick="app.loadPage('dashboard')">
                                <i class="fas fa-tachometer-alt"></i> Go to Dashboard
                            </button>
                        `}
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
                            <option value="WEB_DEVELOPMENT">Web Development</option>
                            <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
                            <option value="UI_UX_DESIGN">UI/UX Design</option>
                            <option value="GRAPHIC_DESIGN">Graphic Design</option>
                            <option value="CONTENT_CREATION">Content Creation</option>
                            <option value="DATA_SCIENCE">Data Science</option>
                            <option value="TUTORING">Tutoring</option>
                            <option value="RESEARCH">Research</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <select id="sortFilter">
                            <option value="newest">Newest First</option>
                            <option value="budget_high">Budget: High to Low</option>
                            <option value="budget_low">Budget: Low to High</option>
                            <option value="deadline">Deadline</option>
                        </select>
                        <button class="btn-primary" onclick="app.filterJobs()">
                            <i class="fas fa-filter"></i> Apply Filters
                        </button>
                        ${this.currentUser && this.currentUser.role === 'STUDENT' ? `
                            <button class="btn-secondary" onclick="app.loadPage('my-proposals')">
                                <i class="fas fa-list"></i> My Proposals
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

    loadJobs() {
        const jobsList = document.getElementById('jobsList');
        if (!jobsList) return;

        // Get filter values
        const searchTerm = document.getElementById('searchJobs')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const sortBy = document.getElementById('sortFilter')?.value || 'newest';

        // Filter jobs
        let filteredJobs = this.jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                                 job.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || job.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sort jobs
        filteredJobs.sort((a, b) => {
            switch(sortBy) {
                case 'budget_high':
                    return b.budget - a.budget;
                case 'budget_low':
                    return a.budget - b.budget;
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                default: // newest
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        // Render jobs
        if (filteredJobs.length === 0) {
            jobsList.innerHTML = `
                <div class="alert alert-warning" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No jobs found matching your criteria. Check back later or try different filters.
                </div>
            `;
            return;
        }

        jobsList.innerHTML = filteredJobs.map(job => `
            <div class="job-card" onclick="app.viewJob(${job.id})">
                <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                    ${this.formatStatus(job.status)}
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

    filterJobs() {
        this.loadJobs();
    }

    viewJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        const modalContent = document.getElementById('jobModalContent');
        modalContent.innerHTML = `
            <div class="job-details">
                <div class="job-details-header">
                    <div>
                        <h1 class="job-details-title">${this.escapeHtml(job.title)}</h1>
                        <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                            ${this.formatStatus(job.status)}
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
                        Client: ${this.escapeHtml(job.clientName)}
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

    submitProposal(jobId) {
        if (!this.currentUser || this.currentUser.role !== 'STUDENT') {
            this.showAlert('You must be a student to submit proposals', 'error');
            return;
        }

        const job = this.jobs.find(j => j.id === jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        // Check if already applied
        const existingProposal = job.proposals?.find(p => p.studentEmail === this.currentUser.email);
        if (existingProposal) {
            this.showAlert('You have already submitted a proposal for this job', 'warning');
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

        // Create proposal
        const proposal = {
            id: Date.now(),
            jobId: jobId,
            jobTitle: job.title,
            studentEmail: this.currentUser.email,
            studentName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            coverLetter: coverLetter,
            proposedAmount: parseFloat(proposedAmount),
            estimatedDays: parseInt(estimatedDays),
            submittedAt: new Date().toISOString(),
            status: 'PENDING'
        };

        // Add to job's proposals
        if (!job.proposals) job.proposals = [];
        job.proposals.push(proposal);

        // Add to global proposals
        this.proposals.push(proposal);
        this.saveToStorage('uep_proposals', this.proposals);
        this.saveToStorage('uep_jobs', this.jobs);

        this.hideModal('jobModal');
        this.showAlert('Proposal submitted successfully!', 'success');
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
                                <option value="WEB_DEVELOPMENT">Web Development</option>
                                <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
                                <option value="UI_UX_DESIGN">UI/UX Design</option>
                                <option value="GRAPHIC_DESIGN">Graphic Design</option>
                                <option value="CONTENT_CREATION">Content Creation</option>
                                <option value="DATA_SCIENCE">Data Science</option>
                                <option value="TUTORING">Tutoring</option>
                                <option value="RESEARCH">Research</option>
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

    handlePostJob(e) {
        e.preventDefault();
        
        const jobData = {
            id: Date.now(),
            title: document.getElementById('jobTitle').value,
            description: document.getElementById('jobDescription').value,
            budget: parseFloat(document.getElementById('jobBudget').value),
            deadline: document.getElementById('jobDeadline').value,
            category: document.getElementById('jobCategory').value,
            status: 'OPEN',
            clientId: this.currentUser.email,
            clientName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            createdAt: new Date().toISOString(),
            proposals: []
        };

        // Validation
        if (jobData.budget < 100) {
            this.showAlert('Budget must be at least ₱100', 'error');
            return;
        }

        this.jobs.unshift(jobData); // Add to beginning
        this.saveToStorage('uep_jobs', this.jobs);
        
        this.showAlert('Job posted successfully!', 'success');
        document.getElementById('postJobForm').reset();
        this.loadPage('jobs');
    }

    renderDashboard() {
        const isStudent = this.currentUser?.role === 'STUDENT';
        const isClient = this.currentUser?.role === 'CLIENT';
        const isAdmin = this.currentUser?.role === 'ADMIN';
        
        return `
            <section class="dashboard">
                <div class="container">
                    <h1>Welcome back, ${this.currentUser?.firstName}!</h1>
                    <p>Here's your freelancing dashboard at a glance</p>
                    
                    <div class="dashboard-grid">
                        ${isStudent ? `
                            <div class="dashboard-card">
                                <h3>Active Proposals</h3>
                                <div class="value" id="activeProposals">0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Accepted Jobs</h3>
                                <div class="value" id="acceptedJobs">0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Total Earnings</h3>
                                <div class="value" id="totalEarnings">₱0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Your Rating</h3>
                                <div class="value" id="userRating">${this.currentUser?.rating || '0.0'}</div>
                            </div>
                        ` : isClient ? `
                            <div class="dashboard-card">
                                <h3>Posted Jobs</h3>
                                <div class="value" id="postedJobs">0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Active Jobs</h3>
                                <div class="value" id="activeJobs">0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Total Spent</h3>
                                <div class="value" id="totalSpent">₱0</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Completed Jobs</h3>
                                <div class="value" id="completedJobs">0</div>
                            </div>
                        ` : isAdmin ? `
                            <div class="dashboard-card">
                                <h3>Total Users</h3>
                                <div class="value" id="totalUsers">${Object.keys(this.demoAccounts).length}</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Total Jobs</h3>
                                <div class="value" id="totalJobs">${this.jobs.length}</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Active Proposals</h3>
                                <div class="value" id="totalProposals">${this.proposals.length}</div>
                            </div>
                            <div class="dashboard-card">
                                <h3>Platform Revenue</h3>
                                <div class="value" id="platformRevenue">₱0</div>
                            </div>
                        ` : ''}
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
                                    <button class="btn-secondary" onclick="app.loadPage('my-proposals')">
                                        <i class="fas fa-list"></i> My Proposals
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('profile')">
                                        <i class="fas fa-user-edit"></i> Update Profile
                                    </button>
                                ` : ''}
                                ${isClient ? `
                                    <button class="btn-primary" onclick="app.loadPage('post-job')">
                                        <i class="fas fa-plus"></i> Post New Job
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('my-jobs')">
                                        <i class="fas fa-briefcase"></i> Manage Jobs
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('freelancers')">
                                        <i class="fas fa-users"></i> Find Freelancers
                                    </button>
                                ` : ''}
                                ${isAdmin ? `
                                    <button class="btn-primary" onclick="app.loadPage('admin-dashboard')">
                                        <i class="fas fa-cog"></i> Admin Dashboard
                                    </button>
                                    <button class="btn-secondary" onclick="app.manageUsers()">
                                        <i class="fas fa-users-cog"></i> Manage Users
                                    </button>
                                    <button class="btn-secondary" onclick="app.viewReports()">
                                        <i class="fas fa-chart-bar"></i> View Reports
                                    </button>
                                ` : ''}
                                <button class="btn-secondary" onclick="app.loadPage('messages')">
                                    <i class="fas fa-envelope"></i> Messages
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    loadDashboardData() {
        setTimeout(() => {
            if (this.currentUser.role === 'STUDENT') {
                const studentProposals = this.proposals.filter(p => p.studentEmail === this.currentUser.email);
                const activeProposals = studentProposals.filter(p => p.status === 'PENDING').length;
                const acceptedJobs = studentProposals.filter(p => p.status === 'ACCEPTED').length;
                const totalEarnings = studentProposals
                    .filter(p => p.status === 'COMPLETED')
                    .reduce((sum, p) => sum + p.proposedAmount, 0);

                document.getElementById('activeProposals').textContent = activeProposals;
                document.getElementById('acceptedJobs').textContent = acceptedJobs;
                document.getElementById('totalEarnings').textContent = `₱${totalEarnings.toLocaleString()}`;
                document.getElementById('userRating').textContent = this.currentUser.rating || '0.0';

            } else if (this.currentUser.role === 'CLIENT') {
                const clientJobs = this.jobs.filter(j => j.clientId === this.currentUser.email);
                const postedJobs = clientJobs.length;
                const activeJobs = clientJobs.filter(j => j.status === 'OPEN' || j.status === 'IN_PROGRESS').length;
                const completedJobs = clientJobs.filter(j => j.status === 'COMPLETED').length;
                const totalSpent = clientJobs
                    .filter(j => j.status === 'COMPLETED')
                    .reduce((sum, j) => sum + j.budget, 0);

                document.getElementById('postedJobs').textContent = postedJobs;
                document.getElementById('activeJobs').textContent = activeJobs;
                document.getElementById('completedJobs').textContent = completedJobs;
                document.getElementById('totalSpent').textContent = `₱${totalSpent.toLocaleString()}`;
            }

            // Load recent activity
            this.loadRecentActivity();
        }, 500);
    }

    loadRecentActivity() {
        const activity = document.getElementById('recentActivity');
        if (!activity) return;

        let activities = [];

        // Get student activities
        if (this.currentUser.role === 'STUDENT') {
            const studentProposals = this.proposals
                .filter(p => p.studentEmail === this.currentUser.email)
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .slice(0, 3);

            activities = studentProposals.map(p => ({
                title: `Proposal submitted for "${p.jobTitle}"`,
                amount: p.proposedAmount,
                date: new Date(p.submittedAt),
                type: 'proposal'
            }));
        }
        // Get client activities
        else if (this.currentUser.role === 'CLIENT') {
            const clientJobs = this.jobs
                .filter(j => j.clientId === this.currentUser.email)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);

            activities = clientJobs.map(j => ({
                title: `Job posted: "${j.title}"`,
                amount: j.budget,
                date: new Date(j.createdAt),
                type: 'job'
            }));
        }

        if (activities.length === 0) {
            activities.push({
                title: 'Welcome to UEP Freelance!',
                amount: 0,
                date: new Date(),
                type: 'welcome'
            });
        }

        activity.innerHTML = activities.map(act => `
            <div style="padding: 1rem 0; border-bottom: 1px solid var(--gray-light);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <strong style="flex: 1;">${act.title}</strong>
                    ${act.amount > 0 ? `<span style="color: var(--success); font-size: 0.9rem;">₱${act.amount.toLocaleString()}</span>` : ''}
                </div>
                <div style="color: var(--text-light); font-size: 0.9rem;">
                    <i class="fas fa-clock"></i> ${this.formatRelativeTime(act.date)}
                </div>
            </div>
        `).join('');
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
                        <option value="web">Web Development</option>
                        <option value="design">Design</option>
                        <option value="writing">Writing</option>
                        <option value="data">Data Science</option>
                        <option value="tutoring">Tutoring</option>
                    </select>
                    <select id="ratingFilter">
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
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

    loadFreelancers() {
        // In a real app, this would come from backend
        // For demo, we'll use the demo accounts that are students
        const studentAccounts = Object.values(this.demoAccounts).filter(acc => acc.role === 'STUDENT');
        
        const freelancersList = document.getElementById('freelancersList');
        if (!freelancersList) return;

        if (studentAccounts.length === 0) {
            freelancersList.innerHTML = `
                <div class="alert alert-warning" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No freelancers found. Be the first to sign up!
                </div>
            `;
            return;
        }

        freelancersList.innerHTML = studentAccounts.map((freelancer, index) => `
            <div class="job-card">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="width: 60px; height: 60px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                        ${freelancer.firstName[0]}${freelancer.lastName[0]}
                    </div>
                    <div>
                        <h3 class="job-title">${freelancer.firstName} ${freelancer.lastName}</h3>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: gold;">⭐ 4.8</span>
                            <span style="color: var(--text-light); font-size: 0.9rem;">
                                15 jobs completed
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="job-budget">₱250/hour</div>
                
                <p style="color: var(--text-light); margin-bottom: 1rem; line-height: 1.5;">
                    <strong>Skills:</strong> Web Development, Design, Programming
                </p>
                
                <p style="color: var(--text-light); margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.4;">
                    ${freelancer.firstName} is a dedicated student freelancer with experience in various projects.
                </p>
                
                <div class="job-meta">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-star"></i> 4.8/5.0
                    </span>
                    <button class="btn-primary" style="font-size: 0.9rem;" onclick="app.viewFreelancerProfile('${freelancer.email}')">
                        View Profile
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewFreelancerProfile(email) {
        this.showAlert('Freelancer profile view coming soon!', 'info');
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
                                <input type="tel" id="profilePhone" value="${this.currentUser?.phone || ''}" placeholder="+63 912 345 6789">
                            </div>
                            
                            ${this.currentUser?.role === 'STUDENT' ? `
                                <div class="form-group">
                                    <label for="profileBio">Bio</label>
                                    <textarea id="profileBio" rows="4">${this.currentUser?.bio || ''}</textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="profileSkills">Skills (comma-separated)</label>
                                    <input type="text" id="profileSkills" value="${this.currentUser?.skills?.join(', ') || ''}" placeholder="Web Development, Design, Programming">
                                </div>
                            ` : ''}
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        `;
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        // Update user data
        this.currentUser.firstName = document.getElementById('profileFirstName').value;
        this.currentUser.lastName = document.getElementById('profileLastName').value;
        this.currentUser.phone = document.getElementById('profilePhone').value;
        
        if (this.currentUser.role === 'STUDENT') {
            this.currentUser.bio = document.getElementById('profileBio').value;
            this.currentUser.skills = document.getElementById('profileSkills').value.split(',').map(s => s.trim()).filter(s => s);
        }
        
        this.saveToStorage('uep_currentUser', this.currentUser);
        this.showAlert('Profile updated successfully!', 'success');
    }

    renderMyJobsPage() {
        if (this.currentUser.role !== 'CLIENT') {
            return this.renderDashboard();
        }

        return `
            <section class="container">
                <h1>My Posted Jobs</h1>
                <p>Manage the jobs you've posted and review proposals</p>
                
                <div class="tabs" style="margin-bottom: 2rem;">
                    <button class="tab active" onclick="app.filterMyJobs('all')">All Jobs</button>
                    <button class="tab" onclick="app.filterMyJobs('open')">Open</button>
                    <button class="tab" onclick="app.filterMyJobs('in_progress')">In Progress</button>
                    <button class="tab" onclick="app.filterMyJobs('completed')">Completed</button>
                </div>
                
                <div id="myJobsList" class="jobs-grid">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading your jobs...</p>
                    </div>
                </div>
            </section>
        `;
    }

    loadMyJobs(filter = 'all') {
        const myJobsList = document.getElementById('myJobsList');
        if (!myJobsList) return;

        const clientJobs = this.jobs.filter(j => j.clientId === this.currentUser.email);
        
        let filteredJobs = clientJobs;
        if (filter !== 'all') {
            filteredJobs = clientJobs.filter(j => j.status.toLowerCase() === filter.toLowerCase().replace('_', '-'));
        }

        if (filteredJobs.length === 0) {
            myJobsList.innerHTML = `
                <div class="alert alert-info" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No jobs found. <a href="#post-job" onclick="app.loadPage('post-job')">Post your first job!</a>
                </div>
            `;
            return;
        }

        myJobsList.innerHTML = filteredJobs.map(job => `
            <div class="job-card">
                <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                    ${this.formatStatus(job.status)}
                </div>
                <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
                <div class="job-budget">₱${job.budget?.toLocaleString() || '0'}</div>
                <p class="job-description">${this.escapeHtml(job.description?.substring(0, 100) || '')}...</p>
                <div style="margin: 1rem 0;">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-users"></i> 
                        ${job.proposals?.length || 0} proposals
                    </span>
                </div>
                <div class="job-meta">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-calendar"></i>
                        ${new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <button class="btn-primary" onclick="app.manageJob(${job.id})">
                        Manage
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterMyJobs(filter) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        this.loadMyJobs(filter);
    }

    manageJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        const modalContent = document.getElementById('jobModalContent');
        modalContent.innerHTML = `
            <div class="job-details">
                <div class="job-details-header">
                    <div>
                        <h1 class="job-details-title">${this.escapeHtml(job.title)}</h1>
                        <div class="status-badge status-${job.status.toLowerCase().replace('_', '-')}">
                            ${this.formatStatus(job.status)}
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
                        <i class="fas fa-users"></i> 
                        ${job.proposals?.length || 0} proposals
                    </span>
                </div>

                <div class="job-details-description">
                    <h3>Job Description</h3>
                    <p>${this.escapeHtml(job.description || 'No description provided.')}</p>
                </div>

                ${job.proposals && job.proposals.length > 0 ? `
                    <div style="margin: 2rem 0;">
                        <h3>Proposals (${job.proposals.length})</h3>
                        ${job.proposals.map((proposal, index) => `
                            <div style="background: var(--background-light); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong>${proposal.studentName}</strong>
                                    <span style="color: var(--primary-color); font-weight: bold;">₱${proposal.proposedAmount.toLocaleString()}</span>
                                </div>
                                <p style="color: var(--text-light); margin-bottom: 0.5rem; font-size: 0.9rem;">
                                    ${proposal.coverLetter.substring(0, 100)}...
                                </p>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn-success btn-small" onclick="app.acceptProposal(${proposal.id})">
                                        Accept
                                    </button>
                                    <button class="btn-secondary btn-small" onclick="app.viewProposal(${proposal.id})">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div style="margin: 2rem 0; padding: 2rem; text-align: center; background: var(--background-light); border-radius: var(--border-radius);">
                        <i class="fas fa-inbox" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
                        <p>No proposals yet</p>
                    </div>
                `}

                <div class="job-details-actions">
                    <button class="btn-primary" onclick="app.editJob(${job.id})">
                        <i class="fas fa-edit"></i> Edit Job
                    </button>
                    <button class="btn-error" onclick="app.deleteJob(${job.id})">
                        <i class="fas fa-trash"></i> Delete Job
                    </button>
                    <button class="btn-secondary" onclick="app.hideModal('jobModal')">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;

        this.showJobModal();
    }

    acceptProposal(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            this.showAlert('Proposal not found', 'error');
            return;
        }

        const job = this.jobs.find(j => j.id === proposal.jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        // Update proposal status
        proposal.status = 'ACCEPTED';
        
        // Update job status
        job.status = 'IN_PROGRESS';
        
        this.saveToStorage('uep_proposals', this.proposals);
        this.saveToStorage('uep_jobs', this.jobs);
        
        this.showAlert('Proposal accepted! Job is now in progress.', 'success');
        this.hideModal('jobModal');
    }

    viewProposal(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            this.showAlert('Proposal not found', 'error');
            return;
        }

        alert(`Proposal Details:\n\nFrom: ${proposal.studentName}\nAmount: ₱${proposal.proposedAmount.toLocaleString()}\nEstimated Days: ${proposal.estimatedDays}\n\nCover Letter:\n${proposal.coverLetter}`);
    }

    editJob(jobId) {
        this.showAlert('Edit job feature coming soon!', 'info');
    }

    deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            this.jobs = this.jobs.filter(j => j.id !== jobId);
            this.saveToStorage('uep_jobs', this.jobs);
            this.showAlert('Job deleted successfully', 'success');
            this.hideModal('jobModal');
            this.loadPage('my-jobs');
        }
    }

    renderMyProposalsPage() {
        if (this.currentUser.role !== 'STUDENT') {
            return this.renderDashboard();
        }

        return `
            <section class="container">
                <h1>My Proposals</h1>
                <p>Track the status of your submitted proposals</p>
                
                <div class="tabs" style="margin-bottom: 2rem;">
                    <button class="tab active" onclick="app.filterMyProposals('all')">All</button>
                    <button class="tab" onclick="app.filterMyProposals('pending')">Pending</button>
                    <button class="tab" onclick="app.filterMyProposals('accepted')">Accepted</button>
                    <button class="tab" onclick="app.filterMyProposals('rejected')">Rejected</button>
                </div>
                
                <div id="myProposalsList" class="jobs-grid">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading your proposals...</p>
                    </div>
                </div>
            </section>
        `;
    }

    loadMyProposals(filter = 'all') {
        const myProposalsList = document.getElementById('myProposalsList');
        if (!myProposalsList) return;

        const studentProposals = this.proposals.filter(p => p.studentEmail === this.currentUser.email);
        
        let filteredProposals = studentProposals;
        if (filter !== 'all') {
            filteredProposals = studentProposals.filter(p => p.status.toLowerCase() === filter.toLowerCase());
        }

        if (filteredProposals.length === 0) {
            myProposalsList.innerHTML = `
                <div class="alert alert-info" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No proposals found. <a href="#jobs" onclick="app.loadPage('jobs')">Browse jobs to submit proposals!</a>
                </div>
            `;
            return;
        }

        myProposalsList.innerHTML = filteredProposals.map(proposal => {
            const job = this.jobs.find(j => j.id === proposal.jobId);
            return `
                <div class="job-card">
                    <div class="status-badge status-${proposal.status.toLowerCase()}">
                        ${this.formatStatus(proposal.status)}
                    </div>
                    <h3 class="job-title">${job ? this.escapeHtml(job.title) : 'Job Not Found'}</h3>
                    <div class="job-budget">₱${proposal.proposedAmount?.toLocaleString() || '0'}</div>
                    <p class="job-description">${this.escapeHtml(proposal.coverLetter?.substring(0, 100) || '')}...</p>
                    <div style="margin: 1rem 0;">
                        <span style="color: var(--text-light); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> 
                            Estimated: ${proposal.estimatedDays} days
                        </span>
                    </div>
                    <div class="job-meta">
                        <span style="color: var(--text-light); font-size: 0.9rem;">
                            <i class="fas fa-calendar"></i>
                            ${new Date(proposal.submittedAt).toLocaleDateString()}
                        </span>
                        <button class="btn-primary" onclick="app.viewProposalDetails(${proposal.id})">
                            View
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterMyProposals(filter) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        this.loadMyProposals(filter);
    }

    viewProposalDetails(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            this.showAlert('Proposal not found', 'error');
            return;
        }

        const job = this.jobs.find(j => j.id === proposal.jobId);
        
        alert(`Proposal Details\n\nJob: ${job?.title || 'N/A'}\nStatus: ${this.formatStatus(proposal.status)}\nProposed Amount: ₱${proposal.proposedAmount.toLocaleString()}\nEstimated Days: ${proposal.estimatedDays}\nSubmitted: ${new Date(proposal.submittedAt).toLocaleDateString()}\n\nCover Letter:\n${proposal.coverLetter}`);
    }

    renderMessagesPage() {
        return `
            <section class="container">
                <h1>Messages</h1>
                <p>Communicate with clients and freelancers</p>
                
                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem; height: 600px;">
                    <div style="background: var(--white); border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow);">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--gray-light);">
                            <h3 style="margin: 0;">Conversations</h3>
                        </div>
                        <div id="conversationList" style="overflow-y: auto; height: calc(100% - 60px);">
                            <div style="padding: 1rem; text-align: center; color: var(--text-light);">
                                <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <p>No conversations yet</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--white); border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column;">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--gray-light);">
                            <h3 style="margin: 0;">Select a conversation</h3>
                        </div>
                        <div id="messageArea" style="flex: 1; padding: 1rem; overflow-y: auto;">
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-light);">
                                <div style="text-align: center;">
                                    <i class="fas fa-comment" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 1rem; border-top: 1px solid var(--gray-light); display: none;" id="messageInputArea">
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" id="messageInput" placeholder="Type your message..." style="flex: 1; padding: 0.75rem; border: 1px solid var(--gray-light); border-radius: var(--border-radius);">
                                <button class="btn-primary" onclick="app.sendMessage()">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderSettingsPage() {
        return `
            <section class="container">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1>Settings</h1>
                    <p>Manage your account preferences</p>
                    
                    <div style="background: var(--white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <div style="margin-bottom: 2rem;">
                            <h3>Notification Settings</h3>
                            <div style="margin-top: 1rem;">
                                <label class="custom-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="checkmark"></span>
                                    Email notifications
                                </label>
                                <label class="custom-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="checkmark"></span>
                                    New job alerts
                                </label>
                                <label class="custom-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="checkmark"></span>
                                    Proposal updates
                                </label>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <h3>Privacy Settings</h3>
                            <div style="margin-top: 1rem;">
                                <label class="custom-checkbox">
                                    <input type="checkbox" checked>
                                    <span class="checkmark"></span>
                                    Show profile to other users
                                </label>
                                <label class="custom-checkbox">
                                    <input type="checkbox">
                                    <span class="checkmark"></span>
                                    Show earnings publicly
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <h3>Account Management</h3>
                            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                                <button class="btn-secondary" onclick="app.changePassword()">
                                    Change Password
                                </button>
                                <button class="btn-error" onclick="app.deleteAccount()">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderAdminDashboard() {
        return `
            <section class="admin-dashboard">
                <div class="container">
                    <h1>Admin Dashboard</h1>
                    <p>Manage the UEP Freelance Network platform</p>
                    
                    <div class="admin-grid">
                        <div class="admin-card">
                            <h3>Total Users</h3>
                            <div class="value">${Object.keys(this.demoAccounts).length}</div>
                        </div>
                        <div class="admin-card">
                            <h3>Active Jobs</h3>
                            <div class="value">${this.jobs.filter(j => j.status === 'OPEN').length}</div>
                        </div>
                        <div class="admin-card">
                            <h3>Total Proposals</h3>
                            <div class="value">${this.proposals.length}</div>
                        </div>
                        <div class="admin-card">
                            <h3>Platform Revenue</h3>
                            <div class="value">₱0</div>
                        </div>
                    </div>
                    
                    <div class="admin-tabs">
                        <button class="admin-tab active" onclick="app.showAdminTab('users')">Users</button>
                        <button class="admin-tab" onclick="app.showAdminTab('jobs')">Jobs</button>
                        <button class="admin-tab" onclick="app.showAdminTab('proposals')">Proposals</button>
                        <button class="admin-tab" onclick="app.showAdminTab('reports')">Reports</button>
                    </div>
                    
                    <div id="adminContent">
                        <div class="admin-table-container">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.values(this.demoAccounts).map(user => `
                                        <tr>
                                            <td>${user.firstName} ${user.lastName}</td>
                                            <td>${user.email}</td>
                                            <td>${user.role}</td>
                                            <td><span class="status status-active">Active</span></td>
                                            <td>
                                                <button class="btn-small btn-secondary">Edit</button>
                                                <button class="btn-small btn-error">Delete</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    showAdminTab(tab) {
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        // In a real app, this would load different content
        this.showAlert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} tab selected`, 'info');
    }

    loadAdminData() {
        // Admin data is loaded in renderAdminDashboard
    }

    // Utility Methods
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
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
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

    formatStatus(status) {
        if (!status) return 'Unknown';
        return status.toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(date).toLocaleDateString();
    }

    changePassword() {
        const newPassword = prompt('Enter new password:');
        if (newPassword && newPassword.length >= 6) {
            this.showAlert('Password changed successfully!', 'success');
        } else {
            this.showAlert('Password must be at least 6 characters', 'error');
        }
    }

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.logout();
            this.showAlert('Account deleted successfully', 'success');
        }
    }

    manageUsers() {
        this.showAlert('User management feature coming soon!', 'info');
    }

    viewReports() {
        this.showAlert('Reports feature coming soon!', 'info');
    }
}

// Initialize the application
const app = new UEPFreelanceApp();

// Make app globally available for onclick handlers
window.app = app;