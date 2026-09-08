package com.cinebook.controller;

import com.cinebook.model.Movie;
import com.cinebook.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * Get all movies, filter by genre, or search by title/genre
     * GET /api/movies
     * GET /api/movies?title=Avengers
     * GET /api/movies?genre=Action
     * GET /api/movies?search=Thriller
     */
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestParam(value = "search", required = false) String search) {
        
        String query = (title != null && !title.trim().isEmpty()) ? title : search;
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(movieService.searchMovies(query));
        }

        if (genre != null && !genre.trim().isEmpty() && !genre.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
        }

        return ResponseEntity.ok(movieService.getAllMovies());
    }

    /**
     * Get movie details by ID
     * GET /api/movies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }
}
