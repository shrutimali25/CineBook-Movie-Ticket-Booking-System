/**
 * CineBook - Movies Management Layer
 * Handles 25+ movies listing, multi-field search (title & genre),
 * category/genre filtering, featured blockbusters, and showtimes selection.
 */

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";

// Client-side cache to enable instant zero-latency filtering
let allMoviesCache = [];
let activeGenreFilter = 'All';
let activeSearchQuery = '';

// Load all movies from backend and apply active filters
async function loadMovies(searchTerm = '', genre = 'All') {
    const moviesContainer = document.getElementById('moviesGrid');
    if (!moviesContainer) return;

    activeSearchQuery = searchTerm;
    activeGenreFilter = genre;

    try {
        // If cache is empty, fetch from backend
        if (allMoviesCache.length === 0) {
            moviesContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div class="spinner"></div>
                    <p style="margin-top: 1rem; color: var(--text-secondary);">Loading movies catalog...</p>
                </div>
            `;
            const fetched = await apiRequest('/movies');
            allMoviesCache = fetched || [];
        }

        // Apply filters across cached movies
        applyMovieFilters();
    } catch (err) {
        moviesContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>
                <h3>Unable to load movies</h3>
                <p>${err.message}</p>
            </div>
        `;
    }
}

// Filter movies by search term (Title OR Genre) and Category Pill
function applyMovieFilters() {
    const moviesContainer = document.getElementById('moviesGrid');
    if (!moviesContainer) return;

    let filtered = [...allMoviesCache];

    // 1. Search Query filter (matches either Title OR Genre)
    if (activeSearchQuery && activeSearchQuery.trim() !== '') {
        const query = activeSearchQuery.trim().toLowerCase();
        filtered = filtered.filter(m => 
            (m.title && m.title.toLowerCase().includes(query)) ||
            (m.genre && m.genre.toLowerCase().includes(query))
        );
    }

    // 2. Category / Genre Pill filter
    if (activeGenreFilter && activeGenreFilter !== 'All') {
        const targetGenre = activeGenreFilter.toLowerCase();
        filtered = filtered.filter(m => 
            m.genre && m.genre.toLowerCase().includes(targetGenre)
        );
    }

    // Render results or show empty state
    if (filtered.length === 0) {
        moviesContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-film"></i>
                <h3>No movies found</h3>
                <p>No titles or genres match "${escapeHtml(activeSearchQuery || activeGenreFilter)}". Try adjusting your search or category filter.</p>
            </div>
        `;
        return;
    }

    renderMovieCards(filtered, moviesContainer);
}

// Render movie cards into the specified grid container
function renderMovieCards(movies, container) {
    const isSubPage = window.location.pathname.includes('/pages/');
    const detailsPath = isSubPage ? 'movie-details.html' : 'pages/movie-details.html';

    container.innerHTML = movies.map(movie => {
        const posterUrl = movie.posterUrl || FALLBACK_POSTER;
        return `
            <div class="movie-card" id="movie-card-${movie.movieId}">
                <div class="poster-container">
                    <img src="${posterUrl}" 
                         alt="${escapeHtml(movie.title)}" 
                         class="movie-poster" 
                         loading="lazy"
                         referrerpolicy="no-referrer"
                         onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
                    <div class="rating-badge">
                        <i class="fa-solid fa-star"></i>
                        <span>${movie.rating || 'N/A'}</span>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title" title="${escapeHtml(movie.title)}">${escapeHtml(movie.title)}</h3>
                    <div class="movie-meta">
                        <span><i class="fa-solid fa-clock"></i> ${movie.duration}</span>
                    </div>
                    <span class="movie-genre-badge">${escapeHtml(movie.genre)}</span>
                    <button class="btn btn-primary btn-book" onclick="selectMovieAndProceed(${movie.movieId}, '${detailsPath}')">
                        <i class="fa-solid fa-ticket"></i> Book Now
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render Featured Movies section (Show 6 prominent blockbusters on homepage)
async function loadFeaturedMovies() {
    const featuredContainer = document.getElementById('featuredMoviesGrid');
    if (!featuredContainer) return;

    try {
        if (allMoviesCache.length === 0) {
            const fetched = await apiRequest('/movies');
            allMoviesCache = fetched || [];
        }

        // Select 6 featured blockbusters (high ratings or curated)
        const featuredIds = [4, 14, 5, 6, 1, 26]; // The Dark Knight, Oppenheimer, Inception, Interstellar, Avengers, RRR
        let featuredList = allMoviesCache.filter(m => featuredIds.includes(m.movieId));

        if (featuredList.length < 6) {
            featuredList = allMoviesCache.slice(0, 6);
        }

        const isSubPage = window.location.pathname.includes('/pages/');
        const detailsPath = isSubPage ? 'movie-details.html' : 'pages/movie-details.html';

        featuredContainer.innerHTML = featuredList.map(movie => {
            const posterUrl = movie.posterUrl || FALLBACK_POSTER;
            return `
                <div class="featured-card" id="featured-card-${movie.movieId}">
                    <div class="featured-poster-box">
                        <img src="${posterUrl}" 
                             alt="${escapeHtml(movie.title)}" 
                             loading="lazy"
                             referrerpolicy="no-referrer"
                             onerror="this.onerror=null; this.src='${FALLBACK_POSTER}';">
                    </div>
                    <div class="featured-info">
                        <div>
                            <span class="featured-badge">
                                <i class="fa-solid fa-award"></i> Featured
                            </span>
                            <h3 class="movie-title" style="font-size: 1.2rem; margin-top: 0.35rem;" title="${escapeHtml(movie.title)}">
                                ${escapeHtml(movie.title)}
                            </h3>
                            <div class="movie-meta" style="margin-bottom: 0.5rem;">
                                <span style="color: var(--accent-amber); font-weight: 700;">
                                    <i class="fa-solid fa-star"></i> ${movie.rating}
                                </span>
                                <span><i class="fa-solid fa-clock"></i> ${movie.duration}</span>
                            </div>
                            <span class="movie-genre-badge" style="margin-bottom: 0.5rem;">${escapeHtml(movie.genre)}</span>
                        </div>
                        <button class="btn btn-primary btn-block" style="font-size: 0.9rem; padding: 0.55rem;"
                                onclick="selectMovieAndProceed(${movie.movieId}, '${detailsPath}')">
                            <i class="fa-solid fa-ticket"></i> Book Now
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load featured movies:', err);
    }
}

// Select a movie and navigate to details page
function selectMovieAndProceed(movieId, detailsPath) {
    localStorage.setItem('selectedMovieId', movieId);
    window.location.href = `${detailsPath}?id=${movieId}`;
}

// Load details for a single movie and its shows
async function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id') || localStorage.getItem('selectedMovieId');

    if (!movieId) {
        showToast('No movie selected', 'error');
        setTimeout(() => window.location.href = 'movies.html', 1500);
        return;
    }

    try {
        const movie = await apiRequest(`/movies/${movieId}`);
        localStorage.setItem('selectedMovieId', movie.movieId);
        localStorage.setItem('selectedMovieTitle', movie.title);
        localStorage.setItem('selectedMoviePoster', movie.posterUrl || FALLBACK_POSTER);

        // Render movie info with fallback image handling
        const posterEl = document.getElementById('moviePoster');
        if (posterEl) {
            posterEl.src = movie.posterUrl || FALLBACK_POSTER;
            posterEl.setAttribute('referrerpolicy', 'no-referrer');
            posterEl.onerror = function() { 
                this.onerror = null; 
                this.src = FALLBACK_POSTER; 
            };
        }

        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('movieGenre').textContent = movie.genre;
        document.getElementById('movieDuration').textContent = movie.duration;
        document.getElementById('movieRating').textContent = movie.rating;
        document.getElementById('movieDescription').textContent = movie.description || 'No description available.';

        // Fetch available shows
        loadMovieShows(movieId);
    } catch (err) {
        showToast(err.message || 'Error loading movie details', 'error');
    }
}

// Fetch and render shows for a movie
async function loadMovieShows(movieId) {
    const showsContainer = document.getElementById('showsGrid');
    if (!showsContainer) return;

    try {
        showsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="spinner"></div>
                <p style="margin-top: 0.5rem; color: var(--text-secondary);">Loading available shows...</p>
            </div>
        `;

        const shows = await apiRequest(`/shows/movie/${movieId}`);

        if (!shows || shows.length === 0) {
            showsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <h3>No shows scheduled</h3>
                    <p>There are currently no active shows available for this movie.</p>
                </div>
            `;
            return;
        }

        showsContainer.innerHTML = shows.map(show => `
            <div class="show-card" id="show-card-${show.showId}">
                <div class="show-date">
                    <i class="fa-solid fa-calendar"></i> ${show.showDate}
                </div>
                <div class="show-time">
                    <i class="fa-solid fa-clock"></i> ${show.showTime}
                </div>
                <div class="show-price">₹${show.ticketPrice} per ticket</div>
                <button class="btn btn-primary btn-block" style="margin-top: 0.5rem; font-size: 0.85rem;" 
                        onclick="selectShowAndProceed(${show.showId}, '${show.showDate}', '${show.showTime}', ${show.ticketPrice})">
                    Select Show
                </button>
            </div>
        `).join('');
    } catch (err) {
        showsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p style="color: #ef4444;">Failed to load shows: ${err.message}</p>
            </div>
        `;
    }
}

// Store selected show details and move to seat selection
function selectShowAndProceed(showId, showDate, showTime, ticketPrice) {
    localStorage.setItem('selectedShowId', showId);
    localStorage.setItem('selectedShowDate', showDate);
    localStorage.setItem('selectedShowTime', showTime);
    localStorage.setItem('selectedTicketPrice', ticketPrice);
    window.location.href = 'seat-selection.html';
}

// Helper to escape HTML tags in movie strings
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Featured movies on homepage
    if (document.getElementById('featuredMoviesGrid')) {
        loadFeaturedMovies();
    }

    // 2. Movies Grid on homepage or movies page
    const moviesGrid = document.getElementById('moviesGrid');
    if (moviesGrid) {
        loadMovies();

        // Search input: searches title AND genre
        const searchInput = document.getElementById('movieSearchInput');
        if (searchInput) {
            let debounceTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    activeSearchQuery = e.target.value.trim();
                    applyMovieFilters();
                }, 250);
            });
        }

        // Category pills / Genre filter buttons
        const categoryPills = document.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const selectedGenre = pill.getAttribute('data-genre') || 'All';
                activeGenreFilter = selectedGenre;
                applyMovieFilters();
            });
        });
    }

    // 3. Movie details page
    if (document.getElementById('movieDetailsSection')) {
        loadMovieDetails();
    }
});
