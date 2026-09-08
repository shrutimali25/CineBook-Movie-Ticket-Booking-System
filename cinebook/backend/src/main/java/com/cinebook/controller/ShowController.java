package com.cinebook.controller;

import com.cinebook.model.Show;
import com.cinebook.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "*")
public class ShowController {

    private final ShowService showService;

    @Autowired
    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    /**
     * Get all shows for a given movie
     * GET /api/shows/movie/{movieId}
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Show>> getShowsByMovie(@PathVariable("movieId") Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovieId(movieId));
    }

    /**
     * Get show details by ID
     * GET /api/shows/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }
}
