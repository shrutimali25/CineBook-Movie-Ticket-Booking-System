package com.cinebook.controller;

import com.cinebook.dto.LoginRequest;
import com.cinebook.model.User;
import com.cinebook.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user
     * POST /api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        User registeredUser = userService.register(user);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully!");
        response.put("userId", registeredUser.getUserId());
        response.put("userName", registeredUser.getName());
        response.put("email", registeredUser.getEmail());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Authenticate and login user
     * POST /api/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("userId", user.getUserId());
        response.put("userName", user.getName());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }
}
