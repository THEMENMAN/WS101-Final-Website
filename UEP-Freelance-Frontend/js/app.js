// UEP FREELANCE APP - COMPLETE WORKING VERSION
// WORKS WITHOUT BACKEND - FULL DEMO MODE
class UEPFreelanceApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.apiBaseUrl = 'http://localhost:8080';
        this.isDemoMode = true; // Force demo mode since backend is not reachable
        this.demoData = this.initializeDemoData();
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupGlobalEventListeners();
        this.loadPage('home');
        this.showAlert('Running in full demo mode. All data is stored locally in your browser.', 'info');
    }

    // ==========================================
    //  DEMO DATA INITIALIZATION
    // ==========================================
    initializeDemoData() {
        return {
            users: [
                {
                    id: 1,
                    email: "admin@uep.edu.ph",
                    password: "password123",
                    firstName: "Admin",
                    lastName: "User",
                    role: "ROLE_ADMIN",
                    phone: "+63 912 345 6789",
                    bio: "Platform Administrator",
                    createdAt: "2024-01-01"
                },
                {
                    id: 2,
                    email: "client@uep.edu.ph",
                    password: "password123",
                    firstName: "Juan",
                    lastName: "Dela Cruz",
                    role: "ROLE_CLIENT",
                    phone: "+63 917 123 4567",
                    bio: "Small Business Owner",
                    createdAt: "2024-01-01"
                },
                {
                    id: 3,
                    email: "student@uep.edu.ph",
                    password: "password123",
                    firstName: "Maria",
                    lastName: "Santos",
                    role: "ROLE_STUDENT",
                    phone: "+63 918 987 6543",
                    bio: "Computer Science Student specializing in web development",
                    skills: "JavaScript, React, Node.js, HTML/CSS",
                    hourlyRate: 250,
                    rating: 4.8,
                    createdAt: "2024-01-01"
                }
            ],
            jobs: [
                {
                    id: 1,
                    title: "Website Design for Local Business",
                    description: "Need a modern website for my small business. Should be responsive and user-friendly with mobile optimization. Looking for clean design and easy navigation.",
                    budget: 15000,
                    deadline: "2024-12-31",
                    category: "WEB",
                    clientId: 2,
                    clientName: "Juan Dela Cruz",
                    status: "OPEN",
                    createdAt: "2024-01-15",
                    skills: "HTML, CSS, JavaScript, Responsive Design",
                    proposalsCount: 3
                },
                {
                    id: 2,
                    title: "Logo Design for Startup",
                    description: "Looking for a creative logo for a new tech startup. Should be modern, memorable, and work well in both color and black/white.",
                    budget: 5000,
                    deadline: "2024-12-20",
                    category: "DESIGN",
                    clientId: 2,
                    clientName: "Juan Dela Cruz",
                    status: "OPEN",
                    createdAt: "2024-01-10",
                    skills: "Adobe Illustrator, Logo Design, Branding",
                    proposalsCount: 5
                },
                {
                    id: 3,
                    title: "Blog Content Writing",
                    description: "Need 10 blog articles about digital marketing trends for 2024. Each article should be 1000+ words with proper research and SEO optimization.",
                    budget: 8000,
                    deadline: "2024-12-25",
                    category: "CONTENT",
                    clientId: 2,
                    clientName: "Juan Dela Cruz",
                    status: "OPEN",
                    createdAt: "2024-01-05",
                    skills: "Content Writing, SEO, Digital Marketing",
                    proposalsCount: 2
                },
                {
                    id: 4,
                    title: "Mobile App Development",
                    description: "Looking for a developer to create a simple iOS/Android app for task management. Should include user authentication and cloud sync.",
                    budget: 25000,
                    deadline: "2024-11-30",
                    category: "WEB",
                    clientId: 2,
                    clientName: "Juan Dela Cruz",
                    status: "IN_PROGRESS",
                    createdAt: "2023-12-28",
                    skills: "React Native, Firebase, Mobile Development",
                    proposalsCount: 4
                },
                {
                    id: 5,
                    title: "Social Media Management",
                    description: "Need someone to manage social media accounts for 1 month. Includes content creation, posting schedule, and engagement tracking.",
                    budget: 7000,
                    deadline: "2024-10-15",
                    category: "CONTENT",
                    clientId: 2,
                    clientName: "Juan Dela Cruz",
                    status: "COMPLETED",
                    createdAt: "2023-12-20",
                    skills: "Social Media, Content Creation, Marketing",
                    proposalsCount: 6
                }
            ],
            freelancers: [
                {
                    id: 1,
                    firstName: "Juan",
                    lastName: "Dela Cruz",
                    email: "juan.delacruz@uep.edu.ph",
                    skills: "Graphic Design, Digital Art, UI/UX Design",
                    rating: 4.8,
                    hourlyRate: 250,
                    completedJobs: 15,
                    bio: "Creative graphic designer with 3 years of experience in branding and digital design.",
                    title: "Graphic Designer"
                },
                {
                    id: 2,
                    firstName: "Maria",
                    lastName: "Santos",
                    email: "maria.santos@uep.edu.ph",
                    skills: "Video Editing, Animation, Motion Graphics",
                    rating: 4.9,
                    hourlyRate: 300,
                    completedJobs: 22,
                    bio: "Professional video editor specializing in corporate videos and social media content.",
                    title: "Video Editor"
                },
                {
                    id: 3,
                    firstName: "Carlos",
                    lastName: "Reyes",
                    email: "carlos.reyes@uep.edu.ph",
                    skills: "Web Development, JavaScript, React, Node.js",
                    rating: 4.7,
                    hourlyRate: 350,
                    completedJobs: 18,
                    bio: "Full-stack developer passionate about creating responsive web applications.",
                    title: "Full Stack Developer"
                }
            ],
            proposals: [],
            payments: [],
            messages: []
        };
    }

    // ==========================================
    //  EVENT LISTENERS - SIMPLIFIED
    // ==========================================
    setupGlobalEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Nav links
            if (target.matches('.nav-link') || target.closest('.nav-link')) {
                e.preventDefault();
                const link = target.matches('.nav-link') ? target : target.closest('.nav-link');
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.loadPage(href.substring(1));
                    this.closeMobileMenu();
                }
            }

            // Demo accounts
            if (target.matches('.demo-account') || target.closest('.demo-account')) {
                e.preventDefault();
                const el = target.matches('.demo-account') ? target : target.closest('.demo-account');
                const email = el.getAttribute('data-email');
                if (email) {
                    document.getElementById('loginEmail').value = email;
                    document.getElementById('loginPassword').value = 'password123';
                    this.showAlert(`Demo account filled: ${email}`, 'info');
                }
            }

            // Close modals
            if (target.matches('.close') || target.closest('.close')) {
                const modal = target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }

            // Modal background click
            if (target.classList.contains('modal')) {
                target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            // User dropdown
            if (target.matches('#userMenu') || target.closest('#userMenu')) {
                e.stopPropagation();
                const dropdown = document.querySelector('.dropdown-content');
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }

            // Dropdown links
            if (target.matches('.dropdown-link')) {
                e.preventDefault();
                if (target.id === 'logoutBtn') {
                    this.logout();
                } else {
                    const href = target.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        this.loadPage(href.substring(1));
                    }
                }
                document.querySelector('.dropdown-content').style.display = 'none';
            }
        });

        // Close dropdowns when clicking outside
        window.addEventListener('click', () => {
            const dropdown = document.querySelector('.dropdown-content');
            if (dropdown) dropdown.style.display = 'none';
        });

        // Mobile menu toggle
        document.getElementById('navToggle').addEventListener('click', () => this.toggleMobileMenu());

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showModal('loginModal'));
        document.getElementById('registerBtn').addEventListener('click', () => this.showModal('registerModal'));
        
        // Show register from login modal
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });
    }

    // ==========================================
    //  AUTHENTICATION
    // ==========================================
    checkAuthStatus() {
        const userData = localStorage.getItem('uep_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUIForAuth();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        this.showLoading();

        // Simulate API delay
        setTimeout(() => {
            // Check demo accounts first
            const demoUser = this.demoData.users.find(u => u.email === email && u.password === password);
            
            if (demoUser) {
                // Remove password from user object
                const { password: _, ...userWithoutPassword } = demoUser;
                this.currentUser = userWithoutPassword;
                localStorage.setItem('uep_user', JSON.stringify(userWithoutPassword));
                
                this.updateUIForAuth();
                this.hideModal('loginModal');
                this.showAlert(`Welcome back, ${userWithoutPassword.firstName}!`, 'success');
                document.getElementById('loginForm').reset();
                
                // Redirect based on role
                if (userWithoutPassword.role.includes('ADMIN')) {
                    this.loadPage('admin-dashboard');
                } else {
                    this.loadPage('dashboard');
                }
            } else {
                this.showAlert('Invalid email or password. Try: admin@uep.edu.ph / password123', 'error');
            }
            
            this.hideLoading();
        }, 500);
    }

    handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const firstName = document.getElementById('regFirstName').value;
        const lastName = document.getElementById('regLastName').value;
        const role = document.getElementById('regRole').value;

        if (!email.endsWith('@uep.edu.ph')) {
            this.showAlert('Must use a valid UEP email address (@uep.edu.ph)', 'error');
            return;
        }

        if (password.length < 6) {
            this.showAlert('Password must be at least 6 characters', 'error');
            return;
        }

        if (!firstName || !lastName || !role) {
            this.showAlert('Please fill in all required fields', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            // Check if user already exists
            const existingUser = this.demoData.users.find(u => u.email === email);
            if (existingUser) {
                this.showAlert('User with this email already exists', 'error');
                this.hideLoading();
                return;
            }

            // Create new user
            const newUser = {
                id: this.demoData.users.length + 1,
                email,
                password,
                firstName,
                lastName,
                role: `ROLE_${role}`,
                phone: document.getElementById('regPhone').value || '',
                createdAt: new Date().toISOString().split('T')[0]
            };

            // Add to demo data
            this.demoData.users.push(newUser);
            
            // Remove password and login
            const { password: _, ...userWithoutPassword } = newUser;
            this.currentUser = userWithoutPassword;
            localStorage.setItem('uep_user', JSON.stringify(userWithoutPassword));
            
            this.updateUIForAuth();
            this.hideModal('registerModal');
            this.showAlert(`Welcome to UEP Freelance, ${firstName}!`, 'success');
            document.getElementById('registerForm').reset();
            
            // Redirect to dashboard
            this.loadPage('dashboard');
            
            this.hideLoading();
        }, 500);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('uep_user');
        
        // Update UI
        document.getElementById('navAuth').style.display = 'flex';
        document.getElementById('navUser').style.display = 'none';
        
        // Close dropdowns
        const dropdown = document.querySelector('.dropdown-content');
        if (dropdown) dropdown.style.display = 'none';
        
        this.loadPage('home');
        this.showAlert('Logged out successfully', 'success');
    }

    updateUIForAuth() {
        if (!this.currentUser) return;

        // Show user menu, hide auth buttons
        document.getElementById('navAuth').style.display = 'none';
        document.getElementById('navUser').style.display = 'flex';
        
        // Update user name
        const userNameElement = document.getElementById('userNameMenu');
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.firstName;
        }

        // Show/hide admin link
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = this.currentUser.role.includes('ADMIN') ? 'block' : 'none';
        }

        // Show/hide post job link
        const postJobLink = document.querySelector('a[href="#post-job"]');
        if (postJobLink) {
            postJobLink.style.display = this.currentUser.role.includes('STUDENT') ? 'none' : 'block';
        }
    }

    // ==========================================
    //  UI HELPERS
    // ==========================================
    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.toggle('active');
        
        // Change icon
        const icon = document.querySelector('#navToggle i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.remove('active');
        
        const icon = document.querySelector('#navToggle i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'flex';
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    }

    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer');
        if (!container) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode === container) {
                container.removeChild(alert);
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

    // ==========================================
    //  PAGE ROUTING
    // ==========================================
    async loadPage(page) {
        this.currentPage = page;
        const app = document.getElementById('app');
        
        if (!app) return;
        
        this.showLoading();

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });

        try {
            let html = '';
            
            switch(page) {
                case 'home':
                    html = this.renderHomePage();
                    break;
                case 'jobs':
                    html = this.renderJobsPage();
                    break;
                case 'freelancers':
                    html = this.renderFreelancersPage();
                    break;
                case 'post-job':
                    if (!this.currentUser) {
                        this.showModal('loginModal');
                        this.hideLoading();
                        return;
                    }
                    if (this.currentUser.role.includes('STUDENT')) {
                        this.showAlert('Only clients can post jobs', 'error');
                        this.loadPage('dashboard');
                        return;
                    }
                    html = this.renderPostJobPage();
                    break;
                case 'dashboard':
                    if (!this.currentUser) {
                        this.showModal('loginModal');
                        this.hideLoading();
                        return;
                    }
                    html = this.renderDashboard();
                    break;
                case 'admin-dashboard':
                    if (!this.currentUser || !this.currentUser.role.includes('ADMIN')) {
                        this.showAlert('Admin access required', 'error');
                        this.loadPage('home');
                        return;
                    }
                    html = this.renderAdminDashboard();
                    break;
                case 'my-jobs':
                    if (!this.currentUser) {
                        this.showModal('loginModal');
                        this.hideLoading();
                        return;
                    }
                    html = this.renderMyJobsPage();
                    break;
                case 'my-proposals':
                    if (!this.currentUser) {
                        this.showModal('loginModal');
                        this.hideLoading();
                        return;
                    }
                    if (!this.currentUser.role.includes('STUDENT')) {
                        this.showAlert('Only students can view proposals', 'error');
                        this.loadPage('dashboard');
                        return;
                    }
                    html = this.renderMyProposalsPage();
                    break;
                case 'profile':
                    if (!this.currentUser) {
                        this.showModal('loginModal');
                        this.hideLoading();
                        return;
                    }
                    html = this.renderProfilePage();
                    break;
                case 'messages':
                    html = this.renderMessagesPage();
                    break;
                case 'settings':
                    html = this.renderSettingsPage();
                    break;
                default:
                    html = this.renderHomePage();
            }

            app.innerHTML = html;
            
            // Load page-specific data
            await this.loadPageData(page);
            
            // Attach page-specific event listeners
            this.attachPageEvents(page);
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.showAlert('Error loading page', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async loadPageData(page) {
        switch(page) {
            case 'jobs':
                this.loadJobs();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'admin-dashboard':
                this.loadAdminData();
                break;
            case 'freelancers':
                this.loadFreelancers();
                break;
            case 'my-jobs':
                this.loadMyJobs();
                break;
            case 'my-proposals':
                this.loadMyProposals();
                break;
        }
    }

    attachPageEvents(page) {
        switch(page) {
            case 'jobs':
                // Search and filter
                const searchInput = document.getElementById('searchJobs');
                const categoryFilter = document.getElementById('categoryFilter');
                
                if (searchInput) {
                    searchInput.addEventListener('input', () => this.loadJobs());
                }
                if (categoryFilter) {
                    categoryFilter.addEventListener('change', () => this.loadJobs());
                }
                break;
                
            case 'post-job':
                const postJobForm = document.getElementById('postJobForm');
                if (postJobForm) {
                    postJobForm.addEventListener('submit', (e) => this.handlePostJob(e));
                }
                break;
                
            case 'profile':
                const profileForm = document.getElementById('profileForm');
                if (profileForm) {
                    profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
                }
                break;
                
            case 'admin-dashboard':
                // Admin tabs
                document.querySelectorAll('.admin-tab').forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        const tabName = e.target.dataset.tab;
                        this.switchAdminTab(tabName);
                    });
                });
                break;
        }
    }

    // ==========================================
    //  PAGE RENDERERS
    // ==========================================
    renderHomePage() {
        return `
            <section class="hero">
                <div class="hero-content">
                    <h1>UEP Student Freelance Network</h1>
                    <p>Connect with talented UEP student freelancers and find amazing opportunities in a secure, university-supported environment.</p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="app.loadPage('jobs')">
                            <i class="fas fa-search"></i> Find Work
                        </button>
                        ${!this.currentUser || !this.currentUser.role.includes('STUDENT') ? `
                            <button class="btn-secondary" onclick="app.loadPage('post-job')">
                                <i class="fas fa-briefcase"></i> Post a Job
                            </button>
                        ` : ''}
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
                            <h3>Secure & Verified</h3>
                            <p>All users verified with UEP email addresses ensuring a trusted community.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-graduation-cap"></i>
                            <h3>Student Focused</h3>
                            <p>Designed specifically for UEP students to gain real-world experience.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-handshake"></i>
                            <h3>Easy Collaboration</h3>
                            <p>Simple tools for posting jobs, submitting proposals, and managing projects.</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-money-bill-wave"></i>
                            <h3>Secure Payments</h3>
                            <p>Escrow system protects both freelancers and clients.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="stats" style="background: var(--primary-color); color: white; padding: 6rem 2rem; text-align: center;">
                <div class="container">
                    <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: white;">Platform Statistics</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-top: 2rem;">
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">156</h3>
                            <p style="font-size: 1.2rem; color: white;">Registered Users</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">24</h3>
                            <p style="font-size: 1.2rem; color: white;">Active Jobs</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">₱452K</h3>
                            <p style="font-size: 1.2rem; color: white;">Total Earnings</p>
                        </div>
                        <div>
                            <h3 style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--accent-color);">4.8</h3>
                            <p style="font-size: 1.2rem; color: white;">Average Rating</p>
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
                            <button class="btn-primary" onclick="app.showModal('registerModal')">
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
                            <option value="WEB">Web Development</option>
                            <option value="DESIGN">Design</option>
                            <option value="CONTENT">Content Writing</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <button class="btn-secondary" onclick="app.loadJobs()">
                            <i class="fas fa-search"></i> Search
                        </button>
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

    renderFreelancersPage() {
        return `
            <section class="container">
                <h1>Find UEP Student Freelancers</h1>
                <p>Browse talented UEP students ready to work on your projects</p>
                
                <div id="freelancersList" class="jobs-grid">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading freelancers...</p>
                    </div>
                </div>
            </section>
        `;
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
                    
                    <form id="postJobForm" style="background: var(--white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <div class="form-group">
                            <label for="jobTitle">Job Title *</label>
                            <input type="text" id="jobTitle" required placeholder="e.g., Website Design for Small Business">
                        </div>
                        
                        <div class="form-group">
                            <label for="jobCategory">Category *</label>
                            <select id="jobCategory" required>
                                <option value="">Select Category</option>
                                <option value="WEB">Web Development</option>
                                <option value="DESIGN">Graphic Design</option>
                                <option value="CONTENT">Content Writing</option>
                                <option value="VIDEO">Video Editing</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="jobBudget">Budget (₱) *</label>
                            <input type="number" id="jobBudget" required min="100" step="50" placeholder="1000">
                        </div>
                        
                        <div class="form-group">
                            <label for="jobDescription">Description *</label>
                            <textarea id="jobDescription" rows="6" required placeholder="Describe the job requirements, deliverables, and any specific skills needed..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="jobDeadline">Deadline</label>
                            <input type="date" id="jobDeadline" min="${minDate}">
                        </div>
                        
                        <div class="form-group">
                            <label for="jobSkills">Required Skills (comma separated)</label>
                            <input type="text" id="jobSkills" placeholder="e.g., HTML, CSS, JavaScript, Photoshop">
                        </div>
                        
                        <button type="submit" class="btn-primary btn-full">
                            <i class="fas fa-paper-plane"></i> Post Job
                        </button>
                    </form>
                </div>
            </section>
        `;
    }

    renderDashboard() {
        const isStudent = this.currentUser?.role.includes('STUDENT');
        
        return `
            <section class="dashboard">
                <div class="container">
                    <h1>Welcome back, ${this.currentUser?.firstName}!</h1>
                    <p>Here's your freelancing dashboard at a glance</p>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-card">
                            <h3>${isStudent ? 'Active Proposals' : 'Active Jobs'}</h3>
                            <div class="value" id="dashActive">0</div>
                        </div>
                        <div class="dashboard-card">
                            <h3>${isStudent ? 'Total Earnings' : 'Total Spent'}</h3>
                            <div class="value" id="dashMoney">₱0</div>
                        </div>
                        <div class="dashboard-card">
                            <h3>${isStudent ? 'Rating' : 'Jobs Posted'}</h3>
                            <div class="value" id="dashRating">0</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-actions">
                        <div>
                            <h3>Recent Activity</h3>
                            <div id="recentActivity" style="min-height: 200px;">
                                <div class="activity-item">
                                    <i class="fas fa-check-circle success"></i>
                                    <div>
                                        <strong>Welcome to UEP Freelance!</strong>
                                        <small>Just now</small>
                                    </div>
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
                                ` : `
                                    <button class="btn-primary" onclick="app.loadPage('post-job')">
                                        <i class="fas fa-plus"></i> Post New Job
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('my-jobs')">
                                        <i class="fas fa-briefcase"></i> Manage Jobs
                                    </button>
                                    <button class="btn-secondary" onclick="app.loadPage('freelancers')">
                                        <i class="fas fa-users"></i> Find Freelancers
                                    </button>
                                `}
                                <button class="btn-secondary" onclick="app.loadPage('settings')">
                                    <i class="fas fa-cog"></i> Settings
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
                    
                    <div class="admin-tabs">
                        <button class="admin-tab active" data-tab="overview">Overview</button>
                        <button class="admin-tab" data-tab="users">Users</button>
                        <button class="admin-tab" data-tab="jobs">Jobs</button>
                    </div>
                    
                    <div id="adminTabContent">
                        <div id="overviewTab" class="admin-tab-content">
                            <div class="admin-grid">
                                <div class="admin-card">
                                    <h3>Total Users</h3>
                                    <div class="value" id="totalUsers">3</div>
                                </div>
                                <div class="admin-card">
                                    <h3>Active Jobs</h3>
                                    <div class="value" id="activeJobs">3</div>
                                </div>
                                <div class="admin-card">
                                    <h3>Total Revenue</h3>
                                    <div class="value" id="totalRevenue">₱52,000</div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="usersTab" class="admin-tab-content" style="display:none">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody id="usersTable">
                                    <!-- Users will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="jobsTab" class="admin-tab-content" style="display:none">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Client</th>
                                        <th>Budget</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="adminJobsTable">
                                    <!-- Jobs will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderMyJobsPage() {
        return `
            <section class="container">
                <h1>My Jobs</h1>
                
                <div id="myJobsList" class="jobs-grid">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading your jobs...</p>
                    </div>
                </div>
            </section>
        `;
    }

    renderMyProposalsPage() {
        return `
            <section class="container">
                <h1>My Proposals</h1>
                
                <div id="myProposalsList" class="jobs-grid">
                    ${this.currentUser?.role.includes('STUDENT') ? `
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Loading your proposals...</p>
                        </div>
                    ` : `
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Only students can submit proposals
                        </div>
                    `}
                </div>
            </section>
        `;
    }

    renderProfilePage() {
        return `
            <section class="container">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1>My Profile</h1>
                    
                    <div style="background: var(--white); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                        <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--gray-light);">
                            <div style="width: 100px; height: 100px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem;">
                                ${this.currentUser?.firstName?.[0]}${this.currentUser?.lastName?.[0]}
                            </div>
                            <div>
                                <h2 style="margin-bottom: 0.5rem;">${this.currentUser?.firstName} ${this.currentUser?.lastName}</h2>
                                <p style="color: var(--text-light); margin-bottom: 0.5rem;">${this.currentUser?.email}</p>
                                <span class="category-tag" style="text-transform: capitalize;">
                                    ${this.currentUser?.role?.replace('ROLE_', '').toLowerCase()}
                                </span>
                            </div>
                        </div>
                        
                        <form id="profileForm">
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
                                <small>Email cannot be changed</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="profilePhone">Phone Number</label>
                                <input type="tel" id="profilePhone" value="${this.currentUser?.phone || ''}" placeholder="+63 912 345 6789">
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

    renderMessagesPage() {
        return `
            <section class="container">
                <h1>Messages</h1>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Messaging feature coming soon.
                </div>
            </section>
        `;
    }

    renderSettingsPage() {
        return `
            <section class="container">
                <h1>Settings</h1>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Settings feature coming soon.
                </div>
                <button class="btn-warning" onclick="app.logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </section>
        `;
    }

    // ==========================================
    //  DATA LOADING METHODS
    // ==========================================
    loadJobs() {
        const list = document.getElementById('jobsList');
        if (!list) return;

        // Get filters
        const searchTerm = document.getElementById('searchJobs')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value;

        // Filter jobs
        let filteredJobs = this.demoData.jobs.filter(job => job.status === 'OPEN');

        if (searchTerm) {
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) || 
                job.description.toLowerCase().includes(searchTerm) ||
                job.skills.toLowerCase().includes(searchTerm)
            );
        }

        if (category) {
            filteredJobs = filteredJobs.filter(job => job.category === category);
        }

        if (filteredJobs.length === 0) {
            list.innerHTML = `
                <div class="alert alert-warning" style="grid-column: 1 / -1;">
                    <i class="fas fa-info-circle"></i>
                    No jobs found matching your criteria.
                </div>
            `;
            return;
        }

        list.innerHTML = filteredJobs.map(job => `
            <div class="job-card" onclick="app.viewJob(${job.id})">
                <div class="status-badge status-${job.status.toLowerCase()}">
                    ${job.status}
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-budget">₱${job.budget.toLocaleString()}</div>
                <p class="job-description">${job.description.substring(0, 150)}...</p>
                <div class="job-meta">
                    <span class="category-tag">${job.category}</span>
                    <span class="deadline">
                        <i class="fas fa-clock"></i> 
                        ${new Date(job.deadline).toLocaleDateString()}
                    </span>
                </div>
                <div class="job-footer">
                    <span style="color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-user"></i> ${job.clientName}
                    </span>
                    <button class="btn-primary" onclick="event.stopPropagation(); app.viewJob(${job.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadFreelancers() {
        const list = document.getElementById('freelancersList');
        if (!list) return;

        list.innerHTML = this.demoData.freelancers.map(freelancer => `
            <div class="job-card freelancer-card">
                <div class="freelancer-avatar">
                    ${freelancer.firstName[0]}${freelancer.lastName[0]}
                </div>
                <h3>${freelancer.firstName} ${freelancer.lastName}</h3>
                <p class="freelancer-title">${freelancer.title || 'Freelancer'}</p>
                <div class="freelancer-rating">
                    ⭐ ${freelancer.rating} (${freelancer.completedJobs} jobs)
                </div>
                <p class="freelancer-skills">
                    <strong>Skills:</strong> ${freelancer.skills}
                </p>
                <div class="freelancer-rate">₱${freelancer.hourlyRate}/hour</div>
                <div class="freelancer-actions">
                    <button class="btn-primary" onclick="app.viewFreelancer(${freelancer.id})">
                        View Profile
                    </button>
                    <button class="btn-secondary" onclick="app.messageFreelancer(${freelancer.id})">
                        Message
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadDashboardData() {
        const isStudent = this.currentUser?.role.includes('STUDENT');
        
        // Update dashboard stats
        document.getElementById('dashActive').textContent = isStudent ? '3' : '2';
        document.getElementById('dashMoney').textContent = isStudent ? '₱25,400' : '₱42,000';
        document.getElementById('dashRating').textContent = isStudent ? '4.8' : '5';
        
        // Update recent activity
        const activity = document.getElementById('recentActivity');
        if (activity) {
            if (isStudent) {
                activity.innerHTML = `
                    <div class="activity-item">
                        <i class="fas fa-check-circle success"></i>
                        <div>
                            <strong>Proposal accepted for "Website Redesign"</strong>
                            <small>2 hours ago • ₱5,000</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-money-bill-wave success"></i>
                        <div>
                            <strong>Payment received for "Logo Design"</strong>
                            <small>1 day ago • ₱2,500</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-bell info"></i>
                        <div>
                            <strong>New job posted in your category</strong>
                            <small>2 days ago</small>
                        </div>
                    </div>
                `;
            } else {
                activity.innerHTML = `
                    <div class="activity-item">
                        <i class="fas fa-bell info"></i>
                        <div>
                            <strong>New proposal for "Website Design"</strong>
                            <small>1 hour ago • ₱15,000</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-check-circle success"></i>
                        <div>
                            <strong>Job "Mobile App UI" completed</strong>
                            <small>2 days ago • ₱8,000</small>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-star warning"></i>
                        <div>
                            <strong>New review received</strong>
                            <small>3 days ago • ⭐⭐⭐⭐⭐</small>
                        </div>
                    </div>
                `;
            }
        }
    }

    loadAdminData() {
        // Update overview stats
        document.getElementById('totalUsers').textContent = this.demoData.users.length;
        document.getElementById('activeJobs').textContent = this.demoData.jobs.filter(j => j.status === 'OPEN').length;
        
        // Load users table
        const usersTable = document.getElementById('usersTable');
        if (usersTable) {
            usersTable.innerHTML = this.demoData.users.map(user => `
                <tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role.replace('ROLE_', '')}</td>
                    <td>${user.createdAt}</td>
                </tr>
            `).join('');
        }
        
        // Load jobs table
        const jobsTable = document.getElementById('adminJobsTable');
        if (jobsTable) {
            jobsTable.innerHTML = this.demoData.jobs.map(job => `
                <tr>
                    <td>${job.title}</td>
                    <td>${job.clientName}</td>
                    <td>₱${job.budget.toLocaleString()}</td>
                    <td><span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span></td>
                </tr>
            `).join('');
        }
    }

    loadMyJobs() {
        const list = document.getElementById('myJobsList');
        if (!list) return;

        // Filter jobs for current user
        const myJobs = this.demoData.jobs.filter(job => 
            job.clientId === this.currentUser?.id || 
            (this.currentUser?.role.includes('ADMIN') && job.status !== 'COMPLETED')
        );

        if (myJobs.length === 0) {
            list.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    You haven't posted any jobs yet.
                </div>
            `;
            return;
        }

        list.innerHTML = myJobs.map(job => `
            <div class="job-card">
                <div class="status-badge status-${job.status.toLowerCase()}">
                    ${job.status}
                </div>
                <h3>${job.title}</h3>
                <div class="job-budget">₱${job.budget.toLocaleString()}</div>
                <p>${job.description.substring(0, 100)}...</p>
                <div class="job-meta">
                    <span class="category-tag">${job.category}</span>
                    <span>${job.proposalsCount} proposals</span>
                </div>
                <div class="job-actions">
                    <button class="btn-primary" onclick="app.viewJobProposals(${job.id})">
                        <i class="fas fa-users"></i> View Proposals
                    </button>
                    <button class="btn-secondary" onclick="app.editJob(${job.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadMyProposals() {
        const list = document.getElementById('myProposalsList');
        if (!list) return;

        // Get user's proposals from localStorage
        const userProposals = JSON.parse(localStorage.getItem('uep_proposals') || '[]').filter(
            p => p.studentId === this.currentUser?.id
        );

        if (userProposals.length === 0) {
            list.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    You haven't submitted any proposals yet.
                    <br>
                    <button class="btn-primary mt-2" onclick="app.loadPage('jobs')">
                        Browse Jobs
                    </button>
                </div>
            `;
            return;
        }

        list.innerHTML = userProposals.map(proposal => {
            const job = this.demoData.jobs.find(j => j.id === proposal.jobId);
            return `
                <div class="job-card">
                    <div class="status-badge status-${proposal.status.toLowerCase()}">
                        ${proposal.status}
                    </div>
                    <h3>${job?.title || 'Unknown Job'}</h3>
                    <div class="job-budget">₱${proposal.proposedAmount?.toLocaleString() || '0'}</div>
                    <p>${proposal.coverLetter?.substring(0, 100) || 'No cover letter'}...</p>
                    <div class="job-meta">
                        <span>Estimated: ${proposal.estimatedDays} days</span>
                        <span>Submitted: ${new Date(proposal.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <button class="btn-primary" onclick="app.viewProposalDetails(${proposal.id})">
                        View Details
                    </button>
                </div>
            `;
        }).join('');
    }

    // ==========================================
    //  JOB/PROPOSAL ACTIONS
    // ==========================================
    viewJob(jobId) {
        const job = this.demoData.jobs.find(j => j.id === jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        const content = document.getElementById('jobModalContent');
        content.innerHTML = `
            <div class="job-details">
                <div class="job-details-header">
                    <h2>${job.title}</h2>
                    <div class="status-badge status-${job.status.toLowerCase()}">
                        ${job.status}
                    </div>
                </div>
                
                <div class="job-budget-large">₱${job.budget.toLocaleString()}</div>
                
                <div class="job-details-meta">
                    <span class="category-tag">${job.category}</span>
                    <span><i class="fas fa-clock"></i> Deadline: ${new Date(job.deadline).toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> Client: ${job.clientName}</span>
                    <span><i class="fas fa-users"></i> ${job.proposalsCount} proposals</span>
                </div>
                
                <div class="job-details-description">
                    <h3>Description</h3>
                    <p>${job.description}</p>
                    
                    ${job.skills ? `
                        <h4>Required Skills:</h4>
                        <div class="skills-list">
                            ${job.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="job-details-actions">
                    ${this.currentUser?.role.includes('STUDENT') ? `
                        <button class="btn-primary" onclick="app.submitProposal(${job.id})">
                            <i class="fas fa-paper-plane"></i> Submit Proposal
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="app.hideModal('jobModal')">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('jobModal');
    }

    submitProposal(jobId) {
        if (!this.currentUser) {
            this.showModal('loginModal');
            return;
        }

        if (!this.currentUser.role.includes('STUDENT')) {
            this.showAlert('Only students can submit proposals', 'error');
            return;
        }

        const job = this.demoData.jobs.find(j => j.id === jobId);
        if (!job) {
            this.showAlert('Job not found', 'error');
            return;
        }

        const content = document.getElementById('proposalModalContent');
        content.innerHTML = `
            <div class="proposal-form">
                <h2>Submit Proposal for "${job.title}"</h2>
                <form id="proposalForm">
                    <div class="form-group">
                        <label>Cover Letter *</label>
                        <textarea id="proposalCoverLetter" rows="4" required placeholder="Explain why you're the best fit for this job..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Proposed Amount (₱) *</label>
                            <input type="number" id="proposalAmount" required min="100" value="${job.budget}" placeholder="15000">
                        </div>
                        <div class="form-group">
                            <label>Estimated Days *</label>
                            <input type="number" id="proposalDays" required min="1" value="14" placeholder="14">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Portfolio/Work Samples URL (optional)</label>
                        <input type="url" id="proposalPortfolio" placeholder="https://yourportfolio.com">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-primary" onclick="app.submitProposalForm(${jobId})">
                            <i class="fas fa-paper-plane"></i> Submit Proposal
                        </button>
                        <button type="button" class="btn-secondary" onclick="app.hideModal('proposalModal')">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal('proposalModal');
    }

    submitProposalForm(jobId) {
        const coverLetter = document.getElementById('proposalCoverLetter').value;
        const amount = document.getElementById('proposalAmount').value;
        const days = document.getElementById('proposalDays').value;
        const portfolio = document.getElementById('proposalPortfolio').value;

        if (!coverLetter || !amount || !days) {
            this.showAlert('Please fill all required fields', 'error');
            return;
        }

        // Get existing proposals
        const proposals = JSON.parse(localStorage.getItem('uep_proposals') || '[]');
        
        // Check if already applied
        const alreadyApplied = proposals.find(p => 
            p.jobId === jobId && p.studentId === this.currentUser.id
        );
        
        if (alreadyApplied) {
            this.showAlert('You have already submitted a proposal for this job', 'error');
            return;
        }

        // Create new proposal
        const newProposal = {
            id: proposals.length + 1,
            jobId: jobId,
            studentId: this.currentUser.id,
            studentName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            coverLetter: coverLetter,
            proposedAmount: parseFloat(amount),
            estimatedDays: parseInt(days),
            portfolioUrl: portfolio,
            status: 'PENDING',
            submittedAt: new Date().toISOString()
        };

        // Save proposal
        proposals.push(newProposal);
        localStorage.setItem('uep_proposals', JSON.stringify(proposals));

        // Update job proposals count
        const job = this.demoData.jobs.find(j => j.id === jobId);
        if (job) {
            job.proposalsCount = (job.proposalsCount || 0) + 1;
        }

        this.hideModal('proposalModal');
        this.hideModal('jobModal');
        this.showAlert('Proposal submitted successfully!', 'success');
        
        // Reload if on proposals page
        if (this.currentPage === 'my-proposals') {
            this.loadMyProposals();
        }
    }

    handlePostJob(e) {
        e.preventDefault();
        
        const title = document.getElementById('jobTitle').value;
        const category = document.getElementById('jobCategory').value;
        const budget = document.getElementById('jobBudget').value;
        const description = document.getElementById('jobDescription').value;
        const deadline = document.getElementById('jobDeadline').value;
        const skills = document.getElementById('jobSkills').value;

        if (!title || !category || !budget || !description) {
            this.showAlert('Please fill all required fields', 'error');
            return;
        }

        // Create new job
        const newJob = {
            id: this.demoData.jobs.length + 1,
            title: title,
            description: description,
            budget: parseFloat(budget),
            deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: category,
            clientId: this.currentUser.id,
            clientName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            status: 'OPEN',
            createdAt: new Date().toISOString().split('T')[0],
            skills: skills,
            proposalsCount: 0
        };

        // Add to demo data
        this.demoData.jobs.push(newJob);

        this.showAlert('Job posted successfully!', 'success');
        this.loadPage('my-jobs');
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('profileFirstName').value;
        const lastName = document.getElementById('profileLastName').value;
        const phone = document.getElementById('profilePhone').value;

        if (!firstName || !lastName) {
            this.showAlert('Please fill in first and last name', 'error');
            return;
        }

        // Update current user
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
        this.currentUser.phone = phone;

        // Update in localStorage
        localStorage.setItem('uep_user', JSON.stringify(this.currentUser));

        // Update UI
        document.getElementById('userNameMenu').textContent = firstName;

        this.showAlert('Profile updated successfully!', 'success');
    }

    // ==========================================
    //  HELPER METHODS
    // ==========================================
    switchAdminTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.admin-tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}Tab`);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        }
        
        // Add active class to clicked tab
        const clickedTab = document.querySelector(`.admin-tab[data-tab="${tabName}"]`);
        if (clickedTab) {
            clickedTab.classList.add('active');
        }
    }

    viewFreelancer(freelancerId) {
        const freelancer = this.demoData.freelancers.find(f => f.id === freelancerId);
        if (!freelancer) {
            this.showAlert('Freelancer not found', 'error');
            return;
        }

        this.showAlert(`Viewing ${freelancer.firstName}'s profile (feature coming soon)`, 'info');
    }

    messageFreelancer(freelancerId) {
        const freelancer = this.demoData.freelancers.find(f => f.id === freelancerId);
        if (!freelancer) {
            this.showAlert('Freelancer not found', 'error');
            return;
        }

        this.showAlert(`Messaging ${freelancer.firstName} (feature coming soon)`, 'info');
    }

    viewJobProposals(jobId) {
        this.showAlert(`Viewing proposals for job ${jobId} (feature coming soon)`, 'info');
    }

    editJob(jobId) {
        this.showAlert(`Editing job ${jobId} (feature coming soon)`, 'info');
    }

    viewProposalDetails(proposalId) {
        this.showAlert(`Viewing proposal ${proposalId} details (feature coming soon)`, 'info');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UEPFreelanceApp();
});