package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserEmailOrderByAppointmentDateDescAppointmentTimeDesc(String email);

    Optional<Appointment> findByIdAndUserEmail(Long id, String email);
}
