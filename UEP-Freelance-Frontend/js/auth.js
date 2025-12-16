class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.userData = JSON.parse(localStorage.getItem('userData') || 'null');
        this.apiBaseUrl = 'http://localhost:8080/api';
    }

    async login(email, password) {
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
                this.token = data.token;
                this.userData = data;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('userData', JSON.stringify(data));
                return { success: true, data };
            } else {
                const error = await response.text();
                return { success: false, error: error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const error = await response.text();
                return { success: false, error: error || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    logout() {
        this.token = null;
        this.userData = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    isAuthenticated() {
        return this.token !== null;
    }

    isStudent() {
        return this.userData && this.userData.role === 'STUDENT';
    }

    isClient() {
        return this.userData && this.userData.role === 'CLIENT';
    }

    isAdmin() {
        return this.userData && this.userData.role === 'ADMIN';
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async refreshToken() {
        // Implement token refresh logic if needed
        console.log('Token refresh would happen here');
    }

    validateUEPEmail(email) {
        return email.toLowerCase().endsWith('@uep.edu.ph');
    }

    validatePassword(password) {
        // Basic password validation
        return password && password.length >= 6;
    }
}

// Create global auth instance
const authManager = new AuthManager();