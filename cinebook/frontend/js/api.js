/**
 * CineBook - API Communication Layer
 * Handles all REST API requests to the backend server.
 */

// Determine backend API URL:
// If running on local port 8080 or file system, default to Spring Boot port 8080.
// Otherwise use relative /api for integrated server.
const API_BASE_URL = (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '')
    ? 'http://localhost:8080/api'
    : '/api';

/**
 * Universal fetch wrapper for CineBook REST APIs
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = (data && (data.message || data.error)) 
                ? (data.message || data.error) 
                : `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error(`[CineBook API Error] [${options.method || 'GET'}] ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Global Toast Notification Helper
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
