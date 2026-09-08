/**
 * CineBook - Booking & Payment Management Layer
 * Handles booking summary, simulated payments, backend booking transactions,
 * ticket generation, and booking cancellation.
 */

let selectedPaymentMethod = 'UPI';

// Initialize Booking Summary Page
function initBookingSummary() {
    if (!isLoggedIn()) {
        showToast('Please login to continue booking', 'info');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    const movieTitle = localStorage.getItem('selectedMovieTitle') || 'Movie';
    const moviePoster = localStorage.getItem('selectedMoviePoster') || FALLBACK_POSTER;
    const showDate = localStorage.getItem('selectedShowDate') || 'N/A';
    const showTime = localStorage.getItem('selectedShowTime') || 'N/A';
    const ticketPrice = parseFloat(localStorage.getItem('selectedTicketPrice')) || 200;
    
    let selectedSeats = [];
    try {
        selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    } catch {
        selectedSeats = [];
    }

    if (selectedSeats.length === 0) {
        showToast('No seats selected', 'error');
        setTimeout(() => window.location.href = 'movies.html', 1200);
        return;
    }

    const numberOfTickets = selectedSeats.length;
    const totalAmount = numberOfTickets * ticketPrice;

    // Populate DOM elements
    const thumbElem = document.getElementById('summaryMovieThumb');
    if (thumbElem) {
        thumbElem.src = moviePoster;
        thumbElem.setAttribute('referrerpolicy', 'no-referrer');
        thumbElem.onerror = function() { this.src = FALLBACK_POSTER; };
    }

    setText('summaryMovieTitle', movieTitle);
    setText('summaryShowDate', showDate);
    setText('summaryShowTime', showTime);
    setText('summarySeats', selectedSeats.join(', '));
    setText('summaryTicketCount', numberOfTickets.toString());
    setText('summaryTicketPrice', `₹${ticketPrice}`);
    setText('summaryTotalAmount', `₹${totalAmount}`);
    setText('payButtonAmount', `PAY ₹${totalAmount}`);

    // Attach Payment Method Selection listeners
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            paymentOptions.forEach(p => p.classList.remove('active'));
            opt.classList.add('active');
            selectedPaymentMethod = opt.dataset.method || 'UPI';
        });
    });

    // Attach Pay button listener
    const btnPay = document.getElementById('btnSimulatePayment');
    if (btnPay) {
        btnPay.addEventListener('click', processPaymentAndBooking);
    }
}

// Helper to safely set text content
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Process Simulated Payment and Create Booking
async function processPaymentAndBooking() {
    const btnPay = document.getElementById('btnSimulatePayment');
    const userId = localStorage.getItem('userId');
    const showId = localStorage.getItem('selectedShowId');
    let selectedSeats = [];

    try {
        selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
    } catch {
        selectedSeats = [];
    }

    if (!userId || !showId || selectedSeats.length === 0) {
        showToast('Incomplete booking information', 'error');
        return;
    }

    try {
        // 1. Show simulated payment loading state
        if (btnPay) {
            btnPay.disabled = true;
            btnPay.innerHTML = `<div class="spinner"></div> Processing Payment...`;
        }

        // Simulate payment delay of 1.2 seconds
        await new Promise(resolve => setTimeout(resolve, 1200));

        // 2. Submit booking request to backend REST API
        const payload = {
            userId: parseInt(userId),
            showId: parseInt(showId),
            seatNumbers: selectedSeats,
            paymentMethod: selectedPaymentMethod
        };

        const result = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (result.success && result.booking) {
            // Save confirmation details in localStorage
            localStorage.setItem('lastBookingConfirmation', JSON.stringify(result.booking));
            
            // Clean up transient selection state
            localStorage.removeItem('selectedSeats');
            
            // Switch to Confirmation view
            renderBookingConfirmation(result.booking);
        }
    } catch (err) {
        showToast(err.message || 'Payment or booking failed. Please try again.', 'error');
        if (btnPay) {
            btnPay.disabled = false;
            const totalAmount = localStorage.getItem('totalAmount') || '0';
            btnPay.innerHTML = `<i class="fa-solid fa-lock"></i> PAY ₹${totalAmount}`;
        }
    }
}

// Render Confirmation Screen
function renderBookingConfirmation(booking) {
    const summaryCard = document.getElementById('bookingSummaryContainer');
    const confirmationContainer = document.getElementById('bookingConfirmationContainer');

    if (summaryCard) summaryCard.style.display = 'none';
    if (confirmationContainer) {
        confirmationContainer.style.display = 'block';
        confirmationContainer.innerHTML = `
            <div class="ticket-wrapper">
                <div class="success-icon-wrapper">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.25rem;">
                    BOOKING SUCCESSFUL!
                </h2>
                <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    Your movie tickets have been confirmed and reserved.
                </p>

                <div class="confirmation-card">
                    <div class="ticket-header">
                        <div>
                            <span class="ticket-field-label">BOOKING REFERENCE</span>
                            <div class="ticket-ref-badge" style="margin-top: 0.35rem;">
                                ${booking.bookingReference}
                            </div>
                        </div>
                        <span class="status-badge status-confirmed">
                            <i class="fa-solid fa-circle-check"></i> ${booking.bookingStatus}
                        </span>
                    </div>

                    <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
                        <img src="${booking.moviePosterUrl || FALLBACK_POSTER}" 
                             alt="${booking.movieTitle}" 
                             style="width: 70px; height: 95px; object-fit: cover; border-radius: 8px;"
                             onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">${booking.movieTitle}</h3>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                                <i class="fa-solid fa-calendar" style="color: var(--accent-red);"></i> ${booking.showDate} &nbsp;|&nbsp; 
                                <i class="fa-solid fa-clock" style="color: var(--accent-red);"></i> ${booking.showTime}
                            </p>
                        </div>
                    </div>

                    <div class="ticket-grid">
                        <div>
                            <span class="ticket-field-label">SEATS</span>
                            <div class="ticket-field-val" style="color: var(--accent-amber);">${booking.seatNumbers}</div>
                        </div>
                        <div>
                            <span class="ticket-field-label">NO. OF TICKETS</span>
                            <div class="ticket-field-val">${booking.numberOfTickets}</div>
                        </div>
                        <div>
                            <span class="ticket-field-label">PAYMENT METHOD</span>
                            <div class="ticket-field-val">${booking.paymentMethod}</div>
                        </div>
                        <div>
                            <span class="ticket-field-label">TOTAL PAID</span>
                            <div class="ticket-field-val" style="color: var(--accent-green); font-size: 1.15rem;">₹${booking.totalAmount}</div>
                        </div>
                    </div>

                    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="my-bookings.html" class="btn btn-primary">
                            <i class="fa-solid fa-ticket"></i> VIEW MY BOOKINGS
                        </a>
                        <a href="../index.html" class="btn btn-secondary">
                            <i class="fa-solid fa-house"></i> BACK TO HOME
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Load Booking History for the Logged-in User
async function loadMyBookings() {
    if (!isLoggedIn()) {
        showToast('Please login to view your bookings', 'info');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    const userId = localStorage.getItem('userId');
    const container = document.getElementById('myBookingsList');
    if (!container) return;

    try {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: var(--text-secondary);">Loading your bookings...</p>
            </div>
        `;

        const bookings = await apiRequest(`/bookings/user/${userId}`);

        if (!bookings || bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-ticket-simple"></i>
                    <h3>No Bookings Found</h3>
                    <p>You haven't booked any movie tickets yet.</p>
                    <a href="movies.html" class="btn btn-primary" style="margin-top: 1.5rem;">
                        <i class="fa-solid fa-film"></i> Browse Movies
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.map(b => {
            const isCancelled = (b.bookingStatus === 'CANCELLED');
            const posterUrl = b.moviePosterUrl || FALLBACK_POSTER;

            return `
                <div class="booking-item-card" id="booking-card-${b.bookingId}">
                    <img src="${posterUrl}" 
                         alt="${b.movieTitle}" 
                         class="booking-item-thumb"
                         referrerpolicy="no-referrer"
                         onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
                    
                    <div class="booking-item-details">
                        <div class="booking-item-top">
                            <div class="booking-item-title">${b.movieTitle}</div>
                            <span class="status-badge ${isCancelled ? 'status-cancelled' : 'status-confirmed'}">
                                <i class="fa-solid ${isCancelled ? 'fa-xmark' : 'fa-check'}"></i> 
                                ${b.bookingStatus}
                            </span>
                        </div>

                        <div class="booking-item-info-row">
                            <span><i class="fa-solid fa-hashtag"></i> <strong>Ref:</strong> ${b.bookingReference}</span>
                            <span><i class="fa-solid fa-calendar"></i> ${b.showDate}</span>
                            <span><i class="fa-solid fa-clock"></i> ${b.showTime}</span>
                        </div>

                        <div class="booking-item-info-row">
                            <span><i class="fa-solid fa-chair"></i> <strong>Seats:</strong> <span style="color: var(--accent-amber);">${b.seatNumbers}</span> (${b.numberOfTickets} tickets)</span>
                            <span><i class="fa-solid fa-credit-card"></i> <strong>Paid:</strong> ₹${b.totalAmount} via ${b.paymentMethod}</span>
                        </div>
                    </div>

                    <div class="booking-item-actions">
                        ${isCancelled ? `
                            <span style="color: #ef4444; font-size: 0.85rem; font-weight: 500;">
                                <i class="fa-solid fa-ban"></i> Cancelled
                            </span>
                        ` : `
                            <button class="btn btn-danger" onclick="cancelUserBooking(${b.bookingId})">
                                <i class="fa-solid fa-xmark"></i> Cancel Booking
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>
                <h3>Error Loading Bookings</h3>
                <p>${err.message}</p>
            </div>
        `;
    }
}

// Cancel a Booking
async function cancelUserBooking(bookingId) {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking? The seats will be released for other users.");
    if (!confirmCancel) return;

    try {
        const response = await apiRequest(`/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });

        showToast(response.message || 'Booking Cancelled Successfully', 'success');
        
        // Reload list to show updated status
        loadMyBookings();
    } catch (err) {
        showToast(err.message || 'Failed to cancel booking', 'error');
    }
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // If on Booking Summary Page
    if (document.getElementById('bookingSummaryContainer')) {
        initBookingSummary();
    }

    // If on My Bookings Page
    if (document.getElementById('myBookingsList')) {
        loadMyBookings();
    }
});
