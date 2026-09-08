package com.cinebook.service;

import com.cinebook.model.Seat;
import com.cinebook.model.Show;
import com.cinebook.repository.SeatRepository;
import com.cinebook.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository, ShowRepository showRepository) {
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
    }

    public List<Seat> getSeatsByShowId(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new IllegalArgumentException("Show not found with id: " + showId));

        // Auto-seed seats if not present yet
        initializeSeatsForShow(show);

        return seatRepository.findByShow_ShowIdOrderBySeatIdAsc(showId);
    }

    @Transactional
    public void initializeSeatsForShow(Show show) {
        if (show == null || show.getShowId() == null) return;
        
        if (!seatRepository.existsByShow_ShowId(show.getShowId())) {
            List<Seat> initialSeats = new ArrayList<>();
            char[] rows = {'A', 'B', 'C', 'D', 'E'};
            for (char row : rows) {
                for (int col = 1; col <= 5; col++) {
                    String seatNumber = "" + row + col;
                    initialSeats.add(new Seat(show, seatNumber, "AVAILABLE"));
                }
            }
            seatRepository.saveAll(initialSeats);
        }
    }

    @Transactional
    public void markSeatsBooked(Long showId, List<String> seatNumbers) {
        for (String seatNum : seatNumbers) {
            Seat seat = seatRepository.findByShow_ShowIdAndSeatNumber(showId, seatNum.trim())
                    .orElseThrow(() -> new IllegalArgumentException("Seat " + seatNum + " not found for show id: " + showId));
            seat.setStatus("BOOKED");
            seatRepository.save(seat);
        }
    }

    @Transactional
    public void markSeatsAvailable(Long showId, List<String> seatNumbers) {
        for (String seatNum : seatNumbers) {
            Seat seat = seatRepository.findByShow_ShowIdAndSeatNumber(showId, seatNum.trim())
                    .orElseThrow(() -> new IllegalArgumentException("Seat " + seatNum + " not found for show id: " + showId));
            seat.setStatus("AVAILABLE");
            seatRepository.save(seat);
        }
    }
}
