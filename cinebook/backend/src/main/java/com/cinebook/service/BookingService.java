package com.cinebook.service;

import com.cinebook.dto.BookingRequest;
import com.cinebook.model.Booking;
import com.cinebook.model.Seat;
import com.cinebook.model.Show;
import com.cinebook.model.User;
import com.cinebook.repository.BookingRepository;
import com.cinebook.repository.SeatRepository;
import com.cinebook.repository.ShowRepository;
import com.cinebook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final SeatService seatService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ShowRepository showRepository,
                          SeatRepository seatRepository,
                          SeatService seatService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.seatService = seatService;
    }

    /**
     * Create a new booking with strict double-booking prevention.
     */
    @Transactional
    public synchronized Booking createBooking(BookingRequest request) {
        // STEP 1: Verify User exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getUserId()));

        // STEP 2: Verify Show exists
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new IllegalArgumentException("Show not found with ID: " + request.getShowId()));

        // STEP 3: Verify seats input
        List<String> requestedSeats = request.getSeatNumbers();
        if (requestedSeats == null || requestedSeats.isEmpty()) {
            throw new IllegalArgumentException("Please select at least one seat.");
        }

        // STEP 4: Check if ALL selected seats exist and are AVAILABLE
        for (String seatNumber : requestedSeats) {
            String trimmedSeat = seatNumber.trim().toUpperCase();
            Seat seat = seatRepository.findByShow_ShowIdAndSeatNumber(show.getShowId(), trimmedSeat)
                    .orElseThrow(() -> new IllegalArgumentException("Seat " + trimmedSeat + " does not exist for this show."));

            if ("BOOKED".equalsIgnoreCase(seat.getStatus())) {
                throw new IllegalStateException("One or more selected seats (" + trimmedSeat + ") are already booked! Please select other seats.");
            }
        }

        // STEP 5: Calculate Total Amount = Ticket Price × Number of Selected Seats
        int numberOfTickets = requestedSeats.size();
        double totalAmount = show.getTicketPrice() * numberOfTickets;

        // STEP 6: Generate Unique Booking Reference (e.g. CB2026XXXX)
        String bookingReference = generateUniqueBookingReference();

        // STEP 7: Create and Save Booking
        String joinedSeats = String.join(", ", requestedSeats);
        Booking booking = new Booking(
                bookingReference,
                user,
                show,
                joinedSeats,
                numberOfTickets,
                totalAmount,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI"
        );

        Booking savedBooking = bookingRepository.save(booking);

        // STEP 8: Mark Selected Seats as BOOKED
        seatService.markSeatsBooked(show.getShowId(), requestedSeats);

        return savedBooking;
    }

    /**
     * Cancel an existing booking and release the seats.
     */
    @Transactional
    public synchronized Booking cancelBooking(Long bookingId) {
        // STEP 1: Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        // Validate not already cancelled
        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new IllegalStateException("This booking is already cancelled.");
        }

        // STEP 2: Update status to CANCELLED
        booking.setBookingStatus("CANCELLED");

        // STEP 3: Release seats back to AVAILABLE
        if (booking.getSeatNumbers() != null && !booking.getSeatNumbers().trim().isEmpty()) {
            String[] seatArray = booking.getSeatNumbers().split(",");
            List<String> seatsToRelease = Arrays.stream(seatArray)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            seatService.markSeatsAvailable(booking.getShow().getShowId(), seatsToRelease);
        }

        return bookingRepository.save(booking);
    }

    /**
     * Get booking history for a specific user.
     */
    public List<Booking> getUserBookings(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        return bookingRepository.findByUser_UserIdOrderByBookingIdDesc(userId);
    }

    /**
     * Helper to generate unique booking reference: CB + Year + 4 random digits
     */
    private String generateUniqueBookingReference() {
        int currentYear = Year.now().getValue();
        String ref;
        do {
            int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            ref = "CB" + currentYear + randomNum;
        } while (bookingRepository.findByBookingReference(ref).isPresent());
        return ref;
    }
}
