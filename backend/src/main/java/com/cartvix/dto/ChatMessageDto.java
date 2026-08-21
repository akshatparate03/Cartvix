package com.cartvix.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private String role; // "user" or "assistant"
    private String content;
}