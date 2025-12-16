class UIManager {
    constructor() {
        this.modals = new Map();
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            this.modals.set(modalId, modal);
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            this.modals.delete(modalId);
        }
    }

    hideAllModals() {
        this.modals.forEach((modal, modalId) => {
            this.hideModal(modalId);
        });
    }

    // Loading states
    showLoading(element) {
        const target = element || document.body;
        target.classList.add('loading');
    }

    hideLoading(element) {
        const target = element || document.body;
        target.classList.remove('loading');
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'block';
        }
    }

    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    toggleElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Form handling
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    setFormValues(formId, values) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(values).forEach(key => {
            const element = form.querySelector(`[name="${key}"]`) || document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = values[key];
                } else if (element.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${values[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = values[key];
                }
            }
        });
    }

    getFormValues(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const values = {};

        for (let [key, value] of formData.entries()) {
            if (values[key]) {
                if (Array.isArray(values[key])) {
                    values[key].push(value);
                } else {
                    values[key] = [values[key], value];
                }
            } else {
                values[key] = value;
            }
        }

        return values;
    }

    // Notification system
    showNotification(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    &times;
                </button>
            </div>
        `;

        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { border-left: 4px solid #48bb78; }
                .notification-error { border-left: 4px solid #f56565; }
                .notification-warning { border-left: 4px solid #ed8936; }
                .notification-info { border-left: 4px solid #4299e1; }
                .notification-content {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                }
                .notification-message {
                    flex: 1;
                    margin-right: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #666;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);

        return notification;
    }

    // Confirmation dialog
    showConfirmation(message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirmation-dialog';
            dialog.innerHTML = `
                <div class="confirmation-backdrop"></div>
                <div class="confirmation-content">
                    <div class="confirmation-message">${message}</div>
                    <div class="confirmation-actions">
                        <button class="btn-secondary confirmation-cancel">${cancelText}</button>
                        <button class="btn-primary confirmation-confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            // Add styles if not already added
            if (!document.getElementById('confirmation-styles')) {
                const styles = document.createElement('style');
                styles.id = 'confirmation-styles';
                styles.textContent = `
                    .confirmation-dialog {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10000;
                    }
                    .confirmation-backdrop {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                    }
                    .confirmation-content {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        min-width: 400px;
                        max-width: 500px;
                    }
                    .confirmation-message {
                        margin-bottom: 2rem;
                        font-size: 1.1rem;
                        line-height: 1.5;
                    }
                    .confirmation-actions {
                        display: flex;
                        gap: 1rem;
                        justify-content: flex-end;
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(dialog);

            // Handle button clicks
            dialog.querySelector('.confirmation-confirm').onclick = () => {
                dialog.remove();
                resolve(true);
            };

            dialog.querySelector('.confirmation-cancel').onclick = () => {
                dialog.remove();
                resolve(false);
            };
        });
    }

    // Pagination helper
    createPagination(currentPage, totalPages, onPageChange) {
        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevButton.innerHTML = '&laquo; Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => currentPage > 1 && onPageChange(currentPage - 1);
        pagination.appendChild(prevButton);

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.onclick = () => onPageChange(i);
            pagination.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextButton.innerHTML = 'Next &raquo;';
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => currentPage < totalPages && onPageChange(currentPage + 1);
        pagination.appendChild(nextButton);

        return pagination;
    }

    // Search and filter helpers
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Local storage helpers
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // Date formatting
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString(undefined, { ...defaultOptions, ...options });
    }

    formatDateTime(date) {
        return new Date(date).toLocaleString();
    }

    // Currency formatting
    formatCurrency(amount, currency = 'PHP') {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // String utilities
    truncate(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }

    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
}

// Create global UI manager instance
const uiManager = new UIManager();