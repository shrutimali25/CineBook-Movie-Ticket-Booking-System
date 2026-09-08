/**
 * CineBook - Authentication & Session Management
 */

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user details
function getCurrentUser() {
    return {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        isLoggedIn: isLoggedIn()
    };
}

// Initialize and sync Navbar authentication state across all pages
function initNavbarAuth() {
    const authNavContainer = document.getElementById('navAuthContainer');
    if (!authNavContainer) return;

    if (isLoggedIn()) {
        const userName = localStorage.getItem('userName') || 'User';
        authNavContainer.innerHTML = `
            <div class="nav-user-badge">
                <i class="fa-solid fa-user"></i>
                <span>${userName}</span>
            </div>
            <button class="btn btn-outline" id="btnLogout" style="padding: 0.35rem 0.8rem; font-size: 0.85rem;">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
            </button>
        `;

        document.getElementById('btnLogout')?.addEventListener('click', handleLogout);
    } else {
        // Find relative path to login page depending on current directory
        const isSubPage = window.location.pathname.includes('/pages/');
        const loginHref = isSubPage ? 'login.html' : 'pages/login.html';
        
        authNavContainer.innerHTML = `
            <a href="${loginHref}" class="btn-nav-auth">
                <i class="fa-solid fa-user"></i> Login
            </a>
        `;
    }
}

// Register user
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btnSubmit = document.getElementById('btnRegisterSubmit');

    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        if (btnSubmit) btnSubmit.disabled = true;
        const response = await apiRequest('/users/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        showToast(response.message || 'Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
    } catch (err) {
        showToast(err.message || 'Registration failed', 'error');
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

// Login user
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btnSubmit = document.getElementById('btnLoginSubmit');

    if (!email || !password) {
        showToast('Please enter your email and password', 'error');
        return;
    }

    try {
        if (btnSubmit) btnSubmit.disabled = true;
        const response = await apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userName', response.userName);
            localStorage.setItem('isLoggedIn', 'true');

            showToast(`Welcome back, ${response.userName}!`, 'success');

            // Redirect back to seat selection / booking if pending, else to movies or home
            const pendingShowId = localStorage.getItem('selectedShowId');
            setTimeout(() => {
                if (pendingShowId) {
                    window.location.href = 'seat-selection.html';
                } else {
                    window.location.href = '../index.html';
                }
            }, 1000);
        }
    } catch (err) {
        showToast(err.message || 'Invalid Email or Password', 'error');
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

// Logout user
function handleLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        const isSubPage = window.location.pathname.includes('/pages/');
        window.location.href = isSubPage ? '../index.html' : 'index.html';
    }, 600);
}

// Auto-run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavbarAuth();

    // Attach form listeners if present on page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
