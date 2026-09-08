package com.cinebook.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    @JsonIgnore
    private Show show;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber; // e.g. "A1", "A2", ..., "E5"

    @Column(name = "status", nullable = false)
    private String status; // "AVAILABLE" or "BOOKED"

    // Default Constructor
    public Seat() {
    }

    // Parameterized Constructor
    public Seat(Show show, String seatNumber, String status) {
        this.show = show;
        this.seatNumber = seatNumber;
        this.status = status;
    }

    // Helper getter for showId in JSON responses
    public Long getShowId() {
        return (show != null) ? show.getShowId() : null;
    }

    // Getters and Setters
    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
