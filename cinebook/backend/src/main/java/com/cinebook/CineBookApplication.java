package com.cinebook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CineBookApplication - Main Spring Boot entry point for the CineBook
 * Online Movie Ticket Booking System.
 */
@SpringBootApplication
public class CineBookApplication {

    public static void main(String[] args) {
        SpringApplication.run(CineBookApplication.class, args);
        System.out.println("====================================================");
        System.out.println("🎬 CineBook Backend Server is successfully running!");
        System.out.println("👉 Access REST APIs at: http://localhost:8080/api");
        System.out.println("====================================================");
    }
}
