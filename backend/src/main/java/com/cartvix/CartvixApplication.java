package com.cartvix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CartvixApplication {
    public static void main(String[] args) {
        SpringApplication.run(CartvixApplication.class, args);
        System.out.println("🚀 Cartvix Backend is running on http://localhost:8080");
    }
}
