package com.example.backend.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.HealthProfileRequest;
import com.example.backend.dto.HealthProfileResponse;
import com.example.backend.service.HealthProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class HealthProfileController {

    private final HealthProfileService healthProfileService;

    @GetMapping
    public ResponseEntity<HealthProfileResponse> getProfile(Principal principal) {
        String userEmail = principal.getName();
        return ResponseEntity.ok(healthProfileService.getProfileByUserEmail(userEmail));
    }

    @PostMapping
    public ResponseEntity<HealthProfileResponse> createProfile(
            Principal principal,
            @Valid @RequestBody HealthProfileRequest request) {
        String userEmail = principal.getName();
        return ResponseEntity.ok(healthProfileService.updateProfileByUserEmail(userEmail, request));
    }

    @PutMapping
    public ResponseEntity<HealthProfileResponse> updateProfile(
            Principal principal,
            @Valid @RequestBody HealthProfileRequest request) {
        String userEmail = principal.getName();
        return ResponseEntity.ok(healthProfileService.updateProfileByUserEmail(userEmail, request));
    }
}
