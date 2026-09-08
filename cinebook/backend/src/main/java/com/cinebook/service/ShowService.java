package com.cinebook.service;

import com.cinebook.model.Movie;
import com.cinebook.model.Show;
import com.cinebook.repository.MovieRepository;
import com.cinebook.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final SeatService seatService;

    @Autowired
    public ShowService(ShowRepository showRepository, MovieRepository movieRepository, SeatService seatService) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.seatService = seatService;
    }

    public List<Show> getShowsByMovieId(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new IllegalArgumentException("Movie not found with id: " + movieId);
        }
        List<Show> shows = showRepository.findByMovie_MovieId(movieId);
        // Ensure seats are initialized for every show
        for (Show show : shows) {
            seatService.initializeSeatsForShow(show);
        }
        return shows;
    }

    public Show getShowById(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new IllegalArgumentException("Show not found with id: " + showId));
        seatService.initializeSeatsForShow(show);
        return show;
    }

    public Show saveShow(Show show) {
        Show savedShow = showRepository.save(show);
        seatService.initializeSeatsForShow(savedShow);
        return savedShow;
    }
}
