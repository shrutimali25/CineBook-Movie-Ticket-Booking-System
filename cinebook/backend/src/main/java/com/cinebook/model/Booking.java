package com.cinebook.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "booking_reference", nullable = false, unique = true)
    private String bookingReference; // e.g. "CB20260001"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(name = "seat_numbers", nullable = false)
    private String seatNumbers; // e.g. "A1, A2"

    @Column(name = "number_of_tickets", nullable = false)
    private Integer numberOfTickets;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; // "UPI", "CARD", "CASH"

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus; // "PENDING", "SUCCESS"

    @Column(name = "booking_status", nullable = false)
    private String bookingStatus; // "CONFIRMED", "CANCELLED"

    @Column(name = "booking_date", nullable = false)
    private String bookingDate;

    // Default Constructor
    public Booking() {
        this.bookingDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.paymentStatus = "SUCCESS";
        this.bookingStatus = "CONFIRMED";
    }

    // Parameterized Constructor
    public Booking(String bookingReference, User user, Show show, String seatNumbers,
                   Integer numberOfTickets, Double totalAmount, String paymentMethod) {
        this.bookingReference = bookingReference;
        this.user = user;
        this.show = show;
        this.seatNumbers = seatNumbers;
        this.numberOfTickets = numberOfTickets;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = "SUCCESS";
        this.bookingStatus = "CONFIRMED";
        this.bookingDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    // JSON Helper getters for Frontend Display
    public Long getUserId() {
        return (user != null) ? user.getUserId() : null;
    }

    public String getUserName() {
        return (user != null) ? user.getName() : null;
    }

    public Long getShowId() {
        return (show != null) ? show.getShowId() : null;
    }

    public String getShowDate() {
        return (show != null) ? show.getShowDate() : null;
    }

    public String getShowTime() {
        return (show != null) ? show.getShowTime() : null;
    }

    public String getMovieTitle() {
        return (show != null && show.getMovie() != null) ? show.getMovie().getTitle() : null;
    }

    public String getMoviePosterUrl() {
        return (show != null && show.getMovie() != null) ? show.getMovie().getPosterUrl() : null;
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(Integer numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }
}
