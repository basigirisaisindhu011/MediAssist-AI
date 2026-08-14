package com.example.backend.service;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.AppointmentRequest;
import com.example.backend.dto.AppointmentResponse;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.AppointmentStatus;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse bookAppointment(String userEmail, AppointmentRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        LocalTime parsedTime;
        try {
            parsedTime = LocalTime.parse(request.getAppointmentTime());
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid time format. Please use HH:mm format (e.g. 10:30)");
        }

        Appointment appointment = Appointment.builder()
                .user(user)
                .doctorName(request.getDoctorName())
                .specialty(request.getSpecialty())
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(parsedTime)
                .reason(request.getReason())
                .status(AppointmentStatus.BOOKED)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getUserAppointments(String userEmail) {
        return appointmentRepository.findByUserEmailOrderByAppointmentDateDescAppointmentTimeDesc(userEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id, String userEmail) {
        Appointment appointment = appointmentRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found or access denied for ID: " + id));
        return mapToResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String userEmail) {
        Appointment appointment = appointmentRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found or access denied for ID: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment updated = appointmentRepository.save(appointment);
        return mapToResponse(updated);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .userId(appointment.getUser().getId())
                .userName(appointment.getUser().getName())
                .doctorName(appointment.getDoctorName())
                .specialty(appointment.getSpecialty())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
