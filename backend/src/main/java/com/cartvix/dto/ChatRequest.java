package com.cartvix.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private List<ChatMessageDto> history; // prior turns, optional
}