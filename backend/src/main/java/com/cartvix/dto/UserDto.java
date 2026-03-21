package com.cartvix.dto;
import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
}
