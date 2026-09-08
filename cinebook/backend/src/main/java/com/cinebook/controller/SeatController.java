package com.cinebook.controller;

import com.cinebook.model.Seat;
import com.cinebook.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    /**
     * Get all seats and their availability status for a show
     * GET /api/seats/show/{showId}
     */
    @GetMapping("/show/{showId}")
    public ResponseEntity<List<Seat>> getSeatsByShow(@PathVariable("showId") Long showId) {
        return ResponseEntity.ok(seatService.getSeatsByShowId(showId));
    }
}
