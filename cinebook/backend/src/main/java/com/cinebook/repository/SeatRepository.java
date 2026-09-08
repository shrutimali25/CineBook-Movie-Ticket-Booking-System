package com.cinebook.repository;

import com.cinebook.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShow_ShowIdOrderBySeatIdAsc(Long showId);
    Optional<Seat> findByShow_ShowIdAndSeatNumber(Long showId, String seatNumber);
    List<Seat> findByShow_ShowIdAndSeatNumberIn(Long showId, List<String> seatNumbers);
    boolean existsByShow_ShowId(Long showId);
}
