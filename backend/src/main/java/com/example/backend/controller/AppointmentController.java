package com.example.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AppointmentRequest;
import com.example.backend.dto.AppointmentResponse;
import com.example.backend.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(
            Principal principal,
            @Valid @RequestBody AppointmentRequest request) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(appointmentService.bookAppointment(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getUserAppointments(Principal principal) {
        String userEmail = principal.getName();
        return ResponseEntity.ok(appointmentService.getUserAppointments(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(
            Principal principal,
            @PathVariable Long id) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(appointmentService.getAppointmentById(id, userEmail));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            Principal principal,
            @PathVariable Long id) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userEmail));
    }
}
