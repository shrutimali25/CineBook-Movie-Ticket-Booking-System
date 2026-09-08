/**
 * CineBook - Interactive Seat Selection Layer
 * Handles fetching show seats, interactive seat map, multiple seat selection, and price calculation.
 */

let selectedSeatsList = [];
let currentTicketPrice = 200;

// Load seats for the chosen show
async function loadSeatsForShow() {
    const showId = localStorage.getItem('selectedShowId');
    const movieTitle = localStorage.getItem('selectedMovieTitle') || 'Movie';
    const showDate = localStorage.getItem('selectedShowDate') || '';
    const showTime = localStorage.getItem('selectedShowTime') || '';
    currentTicketPrice = parseFloat(localStorage.getItem('selectedTicketPrice')) || 200;

    if (!showId) {
        showToast('No show selected. Please select a show first.', 'error');
        setTimeout(() => window.location.href = 'movies.html', 1500);
        return;
    }

    // Display show info header
    const infoHeader = document.getElementById('seatSelectionShowInfo');
    if (infoHeader) {
        infoHeader.innerHTML = `
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #fff;">${movieTitle}</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem;">
                <i class="fa-solid fa-calendar" style="color: var(--accent-red);"></i> ${showDate} &nbsp;|&nbsp; 
                <i class="fa-solid fa-clock" style="color: var(--accent-red);"></i> ${showTime} &nbsp;|&nbsp;
                <i class="fa-solid fa-tag" style="color: var(--accent-amber);"></i> ₹${currentTicketPrice} / ticket
            </p>
        `;
    }

    const seatsGrid = document.getElementById('seatsLayoutContainer');
    if (!seatsGrid) return;

    try {
        seatsGrid.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: var(--text-secondary);">Loading interactive seat map...</p>
            </div>
        `;

        const seats = await apiRequest(`/seats/show/${showId}`);
        renderSeatMap(seats, seatsGrid);
    } catch (err) {
        seatsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>
                <h3>Failed to load seats</h3>
                <p>${err.message}</p>
            </div>
        `;
    }
}

// Render the 5x5 cinema seat grid (Rows A to E, Cols 1 to 5)
function renderSeatMap(seats, container) {
    container.innerHTML = '';
    selectedSeatsList = [];
    updateBookingSummaryBar();

    // Map of seat status by seatNumber
    const seatMap = {};
    seats.forEach(s => {
        seatMap[s.seatNumber.toUpperCase()] = s.status;
    });

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const cols = [1, 2, 3, 4, 5];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);

        const groupDiv = document.createElement('div');
        groupDiv.className = 'seats-row-group';

        cols.forEach(col => {
            const seatNum = `${row}${col}`;
            const status = seatMap[seatNum] || 'AVAILABLE';
            const isBooked = (status === 'BOOKED');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `seat-btn ${isBooked ? 'booked' : 'available'}`;
            btn.id = `seat-${seatNum}`;
            btn.textContent = seatNum;
            btn.dataset.seatNumber = seatNum;

            if (isBooked) {
                btn.disabled = true;
                btn.title = `Seat ${seatNum} is already booked`;
            } else {
                btn.title = `Seat ${seatNum} (₹${currentTicketPrice})`;
                btn.addEventListener('click', () => toggleSeatSelection(btn, seatNum));
            }

            groupDiv.appendChild(btn);
        });

        rowDiv.appendChild(groupDiv);
        container.appendChild(rowDiv);
    });
}

// Toggle selection of a seat
function toggleSeatSelection(buttonElement, seatNumber) {
    const index = selectedSeatsList.indexOf(seatNumber);

    if (index > -1) {
        // Deselect
        selectedSeatsList.splice(index, 1);
        buttonElement.classList.remove('selected');
        buttonElement.classList.add('available');
    } else {
        // Select
        selectedSeatsList.push(seatNumber);
        buttonElement.classList.remove('available');
        buttonElement.classList.add('selected');
    }

    // Sort alphabetically (e.g. A1, A2, B3)
    selectedSeatsList.sort();
    updateBookingSummaryBar();
}

// Update the bottom action bar with current selections and total
function updateBookingSummaryBar() {
    const selectedSeatsElem = document.getElementById('selectedSeatsDisplay');
    const ticketsCountElem = document.getElementById('ticketsCountDisplay');
    const totalPriceElem = document.getElementById('totalPriceDisplay');
    const btnContinue = document.getElementById('btnContinueBooking');

    const count = selectedSeatsList.length;
    const totalAmount = count * currentTicketPrice;

    if (selectedSeatsElem) {
        selectedSeatsElem.textContent = count > 0 ? selectedSeatsList.join(', ') : 'None';
    }
    if (ticketsCountElem) {
        ticketsCountElem.textContent = count.toString();
    }
    if (totalPriceElem) {
        totalPriceElem.textContent = `₹${totalAmount}`;
    }
    if (btnContinue) {
        btnContinue.disabled = (count === 0);
    }
}

// Proceed to booking summary
function proceedToBookingSummary() {
    if (selectedSeatsList.length === 0) {
        showToast('Please select at least one seat to continue', 'error');
        return;
    }

    // Check user login; if not logged in, prompt and redirect to login
    if (!isLoggedIn()) {
        showToast('Please log in to proceed with your booking', 'info');
        localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsList));
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    // Save selection in localStorage
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsList));
    localStorage.setItem('totalAmount', (selectedSeatsList.length * currentTicketPrice).toString());

    window.location.href = 'booking-summary.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('seatsLayoutContainer')) {
        loadSeatsForShow();

        const btnContinue = document.getElementById('btnContinueBooking');
        if (btnContinue) {
            btnContinue.addEventListener('click', proceedToBookingSummary);
        }
    }
});
