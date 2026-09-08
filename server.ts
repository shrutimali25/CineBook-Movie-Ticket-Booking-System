import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for all incoming requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ============================================================
// In-Memory Database Store (Emulates MySQL cinebook_db)
// ============================================================

interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
}

interface Movie {
  movieId: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  description: string;
  posterUrl: string;
}

interface Show {
  showId: number;
  movieId: number;
  showDate: string;
  showTime: string;
  ticketPrice: number;
}

interface Seat {
  seatId: number;
  showId: number;
  seatNumber: string;
  status: 'AVAILABLE' | 'BOOKED';
}

interface Booking {
  bookingId: number;
  bookingReference: string;
  userId: number;
  userName?: string;
  showId: number;
  movieTitle?: string;
  moviePosterUrl?: string;
  showDate?: string;
  showTime?: string;
  seatNumbers: string;
  numberOfTickets: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  bookingDate: string;
}

// Initial Sample Users
const users: User[] = [
  { userId: 1, name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123' },
  { userId: 2, name: 'Priya Patel', email: 'priya@example.com', password: 'password123' }
];

// Complete Collection of 30 Popular Movies with Real Posters
const movies: Movie[] = [
  {
    movieId: 1,
    title: 'Avengers: Endgame',
    genre: 'Action, Sci-Fi',
    duration: '181 min',
    rating: '8.4',
    description: 'After devastating events wiped out half the universe, the remaining Avengers assemble once more to reverse Thanos actions and restore balance to the cosmos.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg'
  },
  {
    movieId: 2,
    title: 'Avengers: Infinity War',
    genre: 'Action, Sci-Fi, Adventure',
    duration: '149 min',
    rating: '8.4',
    description: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of ruin destroys the universe.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg'
  },
  {
    movieId: 3,
    title: 'Spider-Man: No Way Home',
    genre: 'Action, Adventure, Fantasy',
    duration: '148 min',
    rating: '8.2',
    description: 'With Spider-Mans identity revealed, Peter turns to Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg'
  },
  {
    movieId: 4,
    title: 'The Dark Knight',
    genre: 'Action, Crime, Drama',
    duration: '152 min',
    rating: '9.0',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
  },
  {
    movieId: 5,
    title: 'Inception',
    genre: 'Science Fiction, Action',
    duration: '148 min',
    rating: '8.8',
    description: 'A skilled thief who steals corporate secrets through dream-sharing technology is offered a chance to erase his criminal past by executing inception.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg'
  },
  {
    movieId: 6,
    title: 'Interstellar',
    genre: 'Science Fiction, Adventure, Drama',
    duration: '169 min',
    rating: '8.7',
    description: 'When Earth becomes uninhabitable, a former NASA pilot leads a crew on an audacious interstellar voyage through a mysterious wormhole.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'
  },
  {
    movieId: 7,
    title: 'Titanic',
    genre: 'Romance, Drama',
    duration: '194 min',
    rating: '7.9',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic in 1912.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png'
  },
  {
    movieId: 8,
    title: 'Avatar',
    genre: 'Science Fiction, Action, Adventure',
    duration: '162 min',
    rating: '7.9',
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is home.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg'
  },
  {
    movieId: 9,
    title: 'Avatar: The Way of Water',
    genre: 'Science Fiction, Adventure, Action',
    duration: '192 min',
    rating: '7.6',
    description: 'Jake Sully lives with his family on Pandora. When a familiar threat returns, Jake and Neytiri must rally the Na vi to protect their oceanic home.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg'
  },
  {
    movieId: 10,
    title: 'Jurassic World',
    genre: 'Action, Adventure, Science Fiction',
    duration: '124 min',
    rating: '7.0',
    description: 'A new theme park built on the original site of Jurassic Park creates a genetically modified hybrid dinosaur, which escapes and goes on a rampage.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Jurassic_World_poster.jpg'
  },
  {
    movieId: 11,
    title: 'Fast X',
    genre: 'Action, Crime, Thriller',
    duration: '141 min',
    rating: '5.8',
    description: 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes, Dante, who seeks retribution for his fathers death.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/Fast_X_poster.jpg'
  },
  {
    movieId: 12,
    title: 'John Wick: Chapter 4',
    genre: 'Action, Thriller, Crime',
    duration: '169 min',
    rating: '7.7',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with global alliances.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/John_Wick_-_Chapter_4_promotional_poster.jpg'
  },
  {
    movieId: 13,
    title: 'Mission: Impossible - Dead Reckoning',
    genre: 'Action, Thriller, Adventure',
    duration: '163 min',
    rating: '7.7',
    description: 'Ethan Hunt and his IMF team embark on their most dangerous mission yet: to track down a terrifying AI weapon before it falls into the wrong hands.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Mission_Impossible_%E2%80%93_Dead_Reckoning_Part_One_poster.jpg'
  },
  {
    movieId: 14,
    title: 'Oppenheimer',
    genre: 'Drama, History, Thriller',
    duration: '180 min',
    rating: '8.9',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II with the Manhattan Project.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg'
  },
  {
    movieId: 15,
    title: 'Barbie',
    genre: 'Comedy, Fantasy, Adventure',
    duration: '114 min',
    rating: '6.8',
    description: 'Barbie and Ken leave Barbie Land for the real world, discovering the joys and perils of living among humans in this vibrant, thoughtful comedy.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg'
  },
  {
    movieId: 16,
    title: 'The Batman',
    genre: 'Action, Crime, Drama',
    duration: '176 min',
    rating: '7.8',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city hidden corruption.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg'
  },
  {
    movieId: 17,
    title: 'Doctor Strange in the Multiverse of Madness',
    genre: 'Action, Fantasy, Science Fiction',
    duration: '126 min',
    rating: '6.9',
    description: 'Doctor Strange teams up with America Chavez, a teenager who can travel across multiverses, to battle multiple threats across alternate dimensions.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg'
  },
  {
    movieId: 18,
    title: 'Black Panther: Wakanda Forever',
    genre: 'Action, Adventure, Drama',
    duration: '161 min',
    rating: '6.7',
    description: 'The people of Wakanda fight to protect their home from intervening world powers as they mourn King T Challa and confront Namor of Talokan.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Black_Panther_Wakanda_Forever_poster.jpg'
  },
  {
    movieId: 19,
    title: 'Iron Man',
    genre: 'Action, Science Fiction, Adventure',
    duration: '126 min',
    rating: '7.9',
    description: 'After being held captive in an Afghan cave, billionaire Tony Stark creates an advanced armored suit to fight evil and redeem his past.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg'
  },
  {
    movieId: 20,
    title: 'Captain America: Civil War',
    genre: 'Action, Science Fiction, Thriller',
    duration: '147 min',
    rating: '7.8',
    description: 'Political oversight in the Avengers operations sparks a rift between Steve Rogers and Tony Stark, fracturing the heroes into opposing sides.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg'
  },
  {
    movieId: 21,
    title: 'Pushpa: The Rise',
    genre: 'Action, Crime, Drama',
    duration: '179 min',
    rating: '7.6',
    description: 'Violence erupts between red sandalwood smugglers and police in the Seshachalam forests as Pushpa Raj rises through the criminal hierarchy.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg'
  },
  {
    movieId: 22,
    title: 'Pushpa 2: The Rule',
    genre: 'Action, Thriller, Drama',
    duration: '179 min',
    rating: '8.1',
    description: 'Pushpa Raj expands his sandalwood empire into international territories while locked in a relentless confrontation with SP Bhanwar Singh Shekhawat.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2_The_Rule.jpg'
  },
  {
    movieId: 23,
    title: 'Jawan',
    genre: 'Action, Thriller',
    duration: '169 min',
    rating: '8.2',
    description: 'A high-octane emotional journey of a vigilante officer who sets out to rectify the wrongs in society, against the backdrop of an old promise.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg'
  },
  {
    movieId: 24,
    title: 'Chhava',
    genre: 'Action, Historical, Drama',
    duration: '160 min',
    rating: '8.6',
    description: 'The epic saga of Chhatrapati Sambhaji Maharaj, showcasing his fierce leadership, battlefield bravery, and unwavering commitment to Swarajya.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Chhaava_poster.jpg/220px-Chhaava_poster.jpg'
  },
  {
    movieId: 25,
    title: 'K.G.F: Chapter 2',
    genre: 'Action, Crime, Drama',
    duration: '168 min',
    rating: '8.3',
    description: 'In the blood-soaked Kolar Gold Fields, Rocky commands terror and devotion while confronting formidable rivals and the armed government.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg'
  },
  {
    movieId: 26,
    title: 'RRR',
    genre: 'Action, Drama, Adventure',
    duration: '187 min',
    rating: '7.8',
    description: 'A fearless revolutionary and a dedicated police officer forge an unbreakable brotherhood before discovering each others true revolutionary missions.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg'
  },
  {
    movieId: 27,
    title: 'Baahubali 2: The Conclusion',
    genre: 'Action, Fantasy, Drama',
    duration: '167 min',
    rating: '8.2',
    description: 'When Shiva learns of his royal heritage and the betrayal of Amarendra Baahubali, he sets out to reclaim the throne of the Mahishmati Kingdom.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg'
  },
  {
    movieId: 28,
    title: 'Animal',
    genre: 'Action, Crime, Drama',
    duration: '201 min',
    rating: '6.6',
    description: 'The fiercely devoted son of a wealthy industrialist undergoes a violent transformation of vengeance after an assassination attempt on his father.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg'
  },
  {
    movieId: 29,
    title: 'Dangal',
    genre: 'Drama, Biography, Sport',
    duration: '161 min',
    rating: '8.3',
    description: 'Former wrestler Mahavir Singh Phogat coaches his daughters Geeta and Babita towards international glory in the Commonwealth Games.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg'
  },
  {
    movieId: 30,
    title: '3 Idiots',
    genre: 'Comedy, Drama',
    duration: '170 min',
    rating: '8.4',
    description: 'Two friends search for their long-lost companion Rancho, recalling the unforgettable memories and revolutionary ideas of their college days.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg'
  }
];

// Shows for all 30 movies (At least 3 shows per movie, with varied prices ₹150, ₹200, ₹250, ₹300)
const shows: Show[] = [];
let showIdCounter = 1;

const timingTemplates = [
  { time: '10:00 AM', price: 180 },
  { time: '01:30 PM', price: 220 },
  { time: '05:00 PM', price: 250 },
  { time: '08:30 PM', price: 300 }
];

movies.forEach(movie => {
  // Add 3 or 4 shows for each movie
  const showCount = (movie.movieId % 2 === 0) ? 4 : 3;
  const dayOffset = (movie.movieId % 4);
  const showDate = `2026-09-${10 + dayOffset}`;

  for (let i = 0; i < showCount; i++) {
    const template = timingTemplates[i];
    // Slightly adjust price depending on rating
    const adjustedPrice = parseFloat(movie.rating) >= 8.5 ? template.price + 20 : template.price;
    shows.push({
      showId: showIdCounter++,
      movieId: movie.movieId,
      showDate: showDate,
      showTime: template.time,
      ticketPrice: adjustedPrice
    });
  }
});

// Initialize 25 seats (A1-A5, B1-B5, C1-C5, D1-D5, E1-E5) for each show
const seats: Seat[] = [];
let seatIdCounter = 1;
const rows = ['A', 'B', 'C', 'D', 'E'];

shows.forEach(show => {
  rows.forEach(r => {
    for (let c = 1; c <= 5; c++) {
      const seatNum = `${r}${c}`;
      // Pre-book sample seats in Show 1
      const isPreBooked = (show.showId === 1 && (seatNum === 'A3' || seatNum === 'A4'));
      seats.push({
        seatId: seatIdCounter++,
        showId: show.showId,
        seatNumber: seatNum,
        status: isPreBooked ? 'BOOKED' : 'AVAILABLE'
      });
    }
  });
});

// Initial Sample Bookings
const bookings: Booking[] = [
  {
    bookingId: 1,
    bookingReference: 'CB20260001',
    userId: 1,
    userName: 'Rahul Sharma',
    showId: 1,
    movieTitle: 'Avengers: Endgame',
    moviePosterUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
    showDate: '2026-09-10',
    showTime: '10:00 AM',
    seatNumbers: 'A3, A4',
    numberOfTickets: 2,
    totalAmount: 400,
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    bookingStatus: 'CONFIRMED',
    bookingDate: '2026-09-08 14:30:00'
  }
];

let bookingIdCounter = 2;
let refNumberCounter = 1002;

// ============================================================
// REST API ENDPOINTS (Identical to Spring Boot Controllers)
// ============================================================

// 1. User Registration: POST /api/users/register
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Name, email, and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Bad Request', message: 'Email is already registered! Please use a different email.' });
  }

  const newUser: User = {
    userId: users.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password
  };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully!',
    userId: newUser.userId,
    userName: newUser.name,
    email: newUser.email
  });
});

// 2. User Login: POST /api/users/login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Email and password must not be empty' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid Email or Password' });
  }

  res.json({
    success: true,
    message: 'Login successful!',
    userId: user.userId,
    userName: user.name,
    email: user.email
  });
});

// 3. Movies List & Multi-field Search: GET /api/movies?title=... & GET /api/movies?genre=... & GET /api/movies?search=...
app.get('/api/movies', (req, res) => {
  const searchTitle = (req.query.title || req.query.search) as string | undefined;
  const filterGenre = req.query.genre as string | undefined;

  let result = [...movies];

  if (searchTitle && searchTitle.trim()) {
    const q = searchTitle.trim().toLowerCase();
    result = result.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.genre.toLowerCase().includes(q)
    );
  }

  if (filterGenre && filterGenre.trim() && filterGenre.toLowerCase() !== 'all') {
    const g = filterGenre.trim().toLowerCase();
    result = result.filter(m => m.genre.toLowerCase().includes(g));
  }

  res.json(result);
});

// 4. Single Movie: GET /api/movies/:id
app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.movieId === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Not Found', message: `Movie not found with id: ${movieId}` });
  }
  res.json(movie);
});

// 5. Shows by Movie: GET /api/shows/movie/:movieId
app.get('/api/shows/movie/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movieShows = shows.filter(s => s.movieId === movieId);
  res.json(movieShows);
});

// 6. Single Show: GET /api/shows/:id
app.get('/api/shows/:id', (req, res) => {
  const showId = parseInt(req.params.id);
  const show = shows.find(s => s.showId === showId);
  if (!show) {
    return res.status(404).json({ error: 'Not Found', message: `Show not found with id: ${showId}` });
  }
  res.json(show);
});

// 7. Seats by Show: GET /api/seats/show/:showId
app.get('/api/seats/show/:showId', (req, res) => {
  const showId = parseInt(req.params.showId);
  const showSeats = seats.filter(s => s.showId === showId);
  res.json(showSeats);
});

// 8. Create Booking: POST /api/bookings
app.post('/api/bookings', (req, res) => {
  const { userId, showId, seatNumbers, paymentMethod } = req.body;

  // Validate User
  const user = users.find(u => u.userId === parseInt(userId));
  if (!user) {
    return res.status(400).json({ error: 'Bad Request', message: `User not found with ID: ${userId}` });
  }

  // Validate Show
  const show = shows.find(s => s.showId === parseInt(showId));
  if (!show) {
    return res.status(400).json({ error: 'Bad Request', message: `Show not found with ID: ${showId}` });
  }

  // Validate Seats
  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'At least one seat must be selected' });
  }

  // Double-Booking Check
  for (const sNum of seatNumbers) {
    const seatObj = seats.find(s => s.showId === show.showId && s.seatNumber.toUpperCase() === sNum.trim().toUpperCase());
    if (!seatObj) {
      return res.status(400).json({ error: 'Bad Request', message: `Seat ${sNum} does not exist for this show.` });
    }
    if (seatObj.status === 'BOOKED') {
      return res.status(409).json({
        error: 'Conflict / Seat Unavailable',
        message: `One or more selected seats (${sNum}) are already booked! Please select other seats.`
      });
    }
  }

  // Mark seats as BOOKED
  seatNumbers.forEach(sNum => {
    const seatObj = seats.find(s => s.showId === show.showId && s.seatNumber.toUpperCase() === sNum.trim().toUpperCase());
    if (seatObj) seatObj.status = 'BOOKED';
  });

  const movie = movies.find(m => m.movieId === show.movieId);
  const totalAmount = show.ticketPrice * seatNumbers.length;
  const bookingRef = `CB2026${refNumberCounter++}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newBooking: Booking = {
    bookingId: bookingIdCounter++,
    bookingReference: bookingRef,
    userId: user.userId,
    userName: user.name,
    showId: show.showId,
    movieTitle: movie ? movie.title : 'Movie',
    moviePosterUrl: movie ? movie.posterUrl : '',
    showDate: show.showDate,
    showTime: show.showTime,
    seatNumbers: seatNumbers.join(', '),
    numberOfTickets: seatNumbers.length,
    totalAmount: totalAmount,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: 'SUCCESS',
    bookingStatus: 'CONFIRMED',
    bookingDate: now
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking successful!',
    booking: newBooking
  });
});

// 9. User Bookings: GET /api/bookings/user/:userId
app.get('/api/bookings/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userBookings = bookings.filter(b => b.userId === userId);
  res.json(userBookings);
});

// 10. Cancel Booking: PUT /api/bookings/:bookingId/cancel
app.put('/api/bookings/:bookingId/cancel', (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.find(b => b.bookingId === bookingId);

  if (!booking) {
    return res.status(404).json({ error: 'Not Found', message: `Booking not found with ID: ${bookingId}` });
  }

  if (booking.bookingStatus === 'CANCELLED') {
    return res.status(400).json({ error: 'Bad Request', message: 'This booking is already cancelled.' });
  }

  // Release Seats back to AVAILABLE
  const seatList = booking.seatNumbers.split(',').map(s => s.trim().toUpperCase());
  seatList.forEach(sNum => {
    const seatObj = seats.find(s => s.showId === booking.showId && s.seatNumber.toUpperCase() === sNum);
    if (seatObj) {
      seatObj.status = 'AVAILABLE';
    }
  });

  booking.bookingStatus = 'CANCELLED';

  res.json({
    success: true,
    message: 'Booking Cancelled Successfully',
    booking: booking
  });
});

// ============================================================
// Static Frontend File Serving
// ============================================================
const frontendPath = path.join(process.cwd(), 'cinebook', 'frontend');

// Serve static assets (css, js, images)
app.use(express.static(frontendPath));

// Route root / directly to CineBook index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Fallback for direct page requests
app.use((req, res, next) => {
  const possibleFile = path.join(frontendPath, req.path);
  if (fs.existsSync(possibleFile) && fs.statSync(possibleFile).isFile()) {
    return res.sendFile(possibleFile);
  }
  next();
});

// Start Server on Port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 CineBook Application Server running on http://0.0.0.0:${PORT}`);
});
