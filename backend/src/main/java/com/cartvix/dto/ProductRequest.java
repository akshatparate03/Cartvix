package com.cartvix.dto;
import lombok.Data;

@Data
public class ProductRequest {
    private String title;
    private String category;
    private Double price;
    private String description;
    private String imageUrl;
}
