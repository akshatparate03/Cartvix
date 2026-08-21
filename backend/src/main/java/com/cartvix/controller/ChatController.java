package com.cartvix.controller;

import com.cartvix.dto.ApiResponse;
import com.cartvix.dto.ChatRequest;
import com.cartvix.dto.ChatResponse;
import com.cartvix.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest req) {
        try {
            String reply = chatbotService.getReply(req.getMessage(), req.getHistory());
            return ResponseEntity.ok(new ChatResponse(reply));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}