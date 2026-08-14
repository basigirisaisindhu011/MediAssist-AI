package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.dto.AppointmentRequest;
import com.example.backend.dto.AppointmentResponse;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.AppointmentStatus;
import com.example.backend.entity.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void bookAppointment_Success() {
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);
        user.setName("Test Patient");
        user.setEmail(email);

        AppointmentRequest request = AppointmentRequest.builder()
                .doctorName("Dr. Sarah Smith")
                .specialty("Cardiology")
                .appointmentDate(LocalDate.now().plusDays(1))
                .appointmentTime("10:30")
                .reason("Annual heart checkup")
                .build();

        Appointment saved = Appointment.builder()
                .id(50L)
                .user(user)
                .doctorName("Dr. Sarah Smith")
                .specialty("Cardiology")
                .appointmentDate(LocalDate.now().plusDays(1))
                .appointmentTime(LocalTime.of(10, 30))
                .reason("Annual heart checkup")
                .status(AppointmentStatus.BOOKED)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(saved);

        AppointmentResponse response = appointmentService.bookAppointment(email, request);

        assertNotNull(response);
        assertEquals("Dr. Sarah Smith", response.getDoctorName());
        assertEquals(AppointmentStatus.BOOKED, response.getStatus());
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void cancelAppointment_Success() {
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);

        Appointment appointment = Appointment.builder()
                .id(50L)
                .user(user)
                .doctorName("Dr. Sarah Smith")
                .specialty("Cardiology")
                .appointmentDate(LocalDate.now().plusDays(1))
                .appointmentTime(LocalTime.of(10, 30))
                .reason("Heart checkup")
                .status(AppointmentStatus.BOOKED)
                .build();

        when(appointmentRepository.findByIdAndUserEmail(50L, email)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        AppointmentResponse response = appointmentService.cancelAppointment(50L, email);

        assertNotNull(response);
        assertEquals(AppointmentStatus.CANCELLED, response.getStatus());
    }
}
