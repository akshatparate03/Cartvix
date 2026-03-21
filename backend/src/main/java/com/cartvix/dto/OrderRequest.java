package com.cartvix.dto;
import lombok.Data;

@Data
public class OrderRequest {
    private String fullName;
    private String phone;
    private String shippingAddress;
    private String paymentMethod;
    private Double totalAmount;
}
