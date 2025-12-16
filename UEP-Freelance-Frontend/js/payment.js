class PaymentsManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
    }

    async createEscrowPayment(jobId, amount, method) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/payments/escrow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId,
                    amount,
                    method
                })
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to create escrow payment');
        } catch (error) {
            console.error('Error creating escrow payment:', error);
            throw error;
        }
    }

    async releasePayment(paymentId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/payments/${paymentId}/release`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to release payment');
        } catch (error) {
            console.error('Error releasing payment:', error);
            throw error;
        }
    }

    async refundPayment(paymentId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/payments/${paymentId}/refund`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to refund payment');
        } catch (error) {
            console.error('Error refunding payment:', error);
            throw error;
        }
    }

    async processMockPayment(method, accountDetails, amount) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/payments/process-mock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method,
                    accountDetails,
                    amount
                })
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to process payment');
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    async getPaymentStatus(paymentId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBaseUrl}/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch payment status');
        } catch (error) {
            console.error('Error fetching payment status:', error);
            throw error;
        }
    }

    validatePaymentMethod(method) {
        const validMethods = ['GCASH', 'PAYPAL'];
        return validMethods.includes(method);
    }

    formatAmount(amount) {
        return `₱${amount?.toLocaleString() || '0'}`;
    }

    getPaymentMethodDisplay(method) {
        const displays = {
            'GCASH': 'GCash',
            'PAYPAL': 'PayPal'
        };
        return displays[method] || method;
    }

    getPaymentStatusDisplay(status) {
        const displays = {
            'PENDING': 'Pending',
            'HELD_IN_ESCROW': 'Held in Escrow',
            'RELEASED': 'Released',
            'REFUNDED': 'Refunded'
        };
        return displays[status] || status;
    }

    getPaymentStatusClass(status) {
        const classes = {
            'PENDING': 'status-pending',
            'HELD_IN_ESCROW': 'status-in-progress',
            'RELEASED': 'status-completed',
            'REFUNDED': 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    }
}

// Create global payments manager instance
const paymentsManager = new PaymentsManager();