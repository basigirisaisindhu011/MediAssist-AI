package com.example.backend.dto;

import com.example.backend.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private UserDto user;

    public AuthResponse(Long id, String name, String email, String phone, Role role, String token) {
        this.token = token;
        this.user = UserDto.builder()
                .id(id)
                .name(name)
                .email(email)
                .phone(phone)
                .role(role)
                .build();
    }
}