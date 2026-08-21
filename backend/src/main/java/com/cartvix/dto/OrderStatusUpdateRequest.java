package com.cartvix.dto;

import lombok.Data;

// FEATURE: used by the admin's "Manage Orders" panel to move an order to
// the next tracking stage, e.g. { "status": "SHIPPED" }
@Data
public class OrderStatusUpdateRequest {
    private String status;
}