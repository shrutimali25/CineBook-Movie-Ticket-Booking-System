package com.cinebook.controller;

import com.cinebook.dto.BookingRequest;
import com.cinebook.model.Booking;
import com.cinebook.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new movie ticket booking
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Booking successful!");
        response.put("booking", booking);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get booking history for a specific user
     * GET /api/bookings/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    /**
     * Cancel a booking and release seats
     * PUT /api/bookings/{bookingId}/cancel
     */
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable("bookingId") Long bookingId) {
        Booking cancelledBooking = bookingService.cancelBooking(bookingId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Booking Cancelled Successfully");
        response.put("booking", cancelledBooking);
        return ResponseEntity.ok(response);
    }
}
