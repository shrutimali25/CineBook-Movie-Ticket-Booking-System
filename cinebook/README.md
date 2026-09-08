# CineBook – Online Movie Ticket Booking System

A full-stack, college-level Java web application for online movie ticket booking built with **Spring Boot**, **MySQL**, **Spring Data JPA**, **Hibernate**, **HTML5**, **CSS3**, and **JavaScript (Fetch API)**.

---

## 🌟 Features Overview

- **User Authentication:** Simple registration and login system with validation and session management using `localStorage`.
- **Movie Catalog & Search:** Browse blockbusters, search real-time by movie title, and view detailed synopsis, ratings, and genre tags.
- **Showtime Selection:** View multiple show timings (Morning, Afternoon, Evening, Night) with dynamically configured ticket pricing.
- **Interactive Cinema Seat Matrix:** 5x5 screen layout (Rows A to E, Seats 1 to 5) with color-coded states:
  - 🟢 **Available** (clickable)
  - 🟡 **Selected** (highlighted)
  - ⚪ **Booked** (disabled / non-clickable)
- **Automatic Price Calculation:** Dynamic real-time calculation: `Total Amount = Ticket Price × Number of Selected Seats`.
- **Payment Simulation:** Simulated checkout supporting UPI/QR, Credit/Debit Card, and Cash with loading indicators.
- **Strict Double-Booking Prevention:** Backend synchronization and state verification guarantee that seats cannot be double-booked concurrently.
- **Booking Confirmation & Ticket:** Displays booking reference (`CB2026XXXX`), QR/barcode details, seat numbers, and amount paid.
- **Booking History & Cancellation:** View personal reservations and cancel anytime; cancellation automatically frees seats back to `AVAILABLE`.

---

## 🏗️ Architecture & Technology Stack

```
                    FRONTEND
             HTML5 + CSS3 + Vanilla JavaScript
                       │
                       ▼ Fetch API (JSON)
                SPRING BOOT (Port 8080)
                 JAVA REST CONTROLLERS
                       │
                       ▼
                    SERVICES (Business & Booking Logic)
                       │
                       ▼
                  REPOSITORIES (Spring Data JPA)
                       │
                       ▼
                 HIBERNATE / JPA ORM
                       │
                       ▼
                    MYSQL DATABASE (cinebook_db)
```

### Tech Stack Details:
- **Frontend:** HTML5, CSS3, Modern Vanilla JavaScript (ES6+), Font Awesome 6 CDN
- **Backend:** Java 17+, Spring Boot 3.2.x, Spring Web, Spring Data JPA, Hibernate, Jakarta Validation
- **Database:** MySQL 8.0+
- **Build Tool:** Apache Maven

---

## 📁 Complete Project Structure

```
cinebook/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/cinebook/
│           │   ├── CineBookApplication.java
│           │   ├── controller/
│           │   │   ├── UserController.java
│           │   │   ├── MovieController.java
│           │   │   ├── ShowController.java
│           │   │   ├── SeatController.java
│           │   │   └── BookingController.java
│           │   ├── service/
│           │   │   ├── UserService.java
│           │   │   ├── MovieService.java
│           │   │   ├── ShowService.java
│           │   │   ├── SeatService.java
│           │   │   └── BookingService.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── MovieRepository.java
│           │   │   ├── ShowRepository.java
│           │   │   ├── SeatRepository.java
│           │   │   └── BookingRepository.java
│           │   ├── model/
│           │   │   ├── User.java
│           │   │   ├── Movie.java
│           │   │   ├── Show.java
│           │   │   ├── Seat.java
│           │   │   └── Booking.java
│           │   ├── dto/
│           │   │   ├── LoginRequest.java
│           │   │   └── BookingRequest.java
│           │   ├── exception/
│           │   │   └── GlobalExceptionHandler.java
│           │   └── config/
│           │       └── WebConfig.java
│           └── resources/
│               ├── application.properties
│               └── data.sql
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── seats.js
│   │   └── booking.js
│   └── pages/
│       ├── login.html
│       ├── register.html
│       ├── movies.html
│       ├── movie-details.html
│       ├── seat-selection.html
│       ├── booking-summary.html
│       └── my-bookings.html
└── README.md
```

---

## 🗄️ MySQL Database Setup

### Step 1: Open MySQL CLI or MySQL Workbench
Log into MySQL:
```bash
mysql -u root -p
```
Enter your password.

### Step 2: Create the Database
```sql
CREATE DATABASE IF NOT EXISTS cinebook_db;
USE cinebook_db;
```

Hibernate `ddl-auto=update` in `application.properties` will automatically create all tables:
- `users`
- `movies`
- `shows`
- `seats`
- `bookings`

---

## ⚙️ Backend Configuration

Open `backend/src/main/resources/application.properties`:
```properties
server.port=8080
spring.application.name=CineBook

# MySQL Database Credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/cinebook_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
# 👉 REPLACE 'YOUR_PASSWORD' WITH YOUR LOCAL MYSQL PASSWORD HERE:
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🚀 How to Run the Application

### 1. Run Spring Boot Backend
#### Using IntelliJ IDEA / Eclipse:
1. Open IntelliJ or Eclipse.
2. File -> Open -> Select the `cinebook/backend` folder.
3. Allow Maven to download dependencies.
4. Locate `com.cinebook.CineBookApplication.java`.
5. Right-click and select **Run 'CineBookApplication'**.
6. The backend will start on **`http://localhost:8080`**.

#### Using Command Line / Terminal:
```bash
cd cinebook/backend
mvn clean spring-boot:run
```

### 2. Run Frontend
You can open `frontend/index.html` directly in any web browser, or use VS Code Live Server:
1. Open VS Code.
2. Open `cinebook/frontend` folder.
3. Right-click on `index.html` -> **Open with Live Server**.
4. Access the web app in your browser at `http://127.0.0.1:5500` or `http://localhost:3000`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Sample Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/users/register` | Register new user | `{"name":"Rahul","email":"rahul@test.com","password":"123"}` |
| `POST` | `/api/users/login` | Authenticate user | `{"email":"rahul@test.com","password":"123"}` |
| `GET` | `/api/movies` | Fetch all movies | None |
| `GET` | `/api/movies?title=Avengers`| Search movie by title | None |
| `GET` | `/api/movies/{id}` | Get single movie details | None |
| `GET` | `/api/shows/movie/{movieId}`| Get all shows for movie | None |
| `GET` | `/api/seats/show/{showId}` | Get 25 seats with availability | None |
| `POST` | `/api/bookings` | Book seats & simulate payment | `{"userId":1,"showId":1,"seatNumbers":["A1","A2"],"paymentMethod":"UPI"}` |
| `GET` | `/api/bookings/user/{userId}`| User booking history | None |
| `PUT` | `/api/bookings/{id}/cancel` | Cancel booking & release seats| None |

---

## 🧪 Testing with Postman

1. **Register User**:
   - `POST http://localhost:8080/api/users/register`
   - Body (raw JSON): `{"name":"Aman","email":"aman@example.com","password":"password123"}`
2. **Login User**:
   - `POST http://localhost:8080/api/users/login`
   - Body: `{"email":"aman@example.com","password":"password123"}`
3. **Get Movies**:
   - `GET http://localhost:8080/api/movies`
4. **Get Seats for Show 1**:
   - `GET http://localhost:8080/api/seats/show/1`
5. **Create Booking**:
   - `POST http://localhost:8080/api/bookings`
   - Body: `{"userId":1,"showId":1,"seatNumbers":["B1","B2"],"paymentMethod":"UPI"}`
6. **Cancel Booking**:
   - `PUT http://localhost:8080/api/bookings/1/cancel`
