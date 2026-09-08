package com.cinebook.service;

import com.cinebook.model.Movie;
import com.cinebook.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found with id: " + movieId));
    }

    public List<Movie> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return movieRepository.findAll();
        }
        String trimmed = query.trim();
        return movieRepository.findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(trimmed, trimmed);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        if (genre == null || genre.trim().isEmpty() || genre.equalsIgnoreCase("All")) {
            return movieRepository.findAll();
        }
        return movieRepository.findByGenreContainingIgnoreCase(genre.trim());
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }
}
