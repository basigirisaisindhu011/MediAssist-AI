package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.dto.HealthProfileRequest;
import com.example.backend.dto.HealthProfileResponse;
import com.example.backend.entity.HealthProfile;
import com.example.backend.entity.User;
import com.example.backend.repository.HealthProfileRepository;
import com.example.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class HealthProfileServiceTest {

    @Mock
    private HealthProfileRepository healthProfileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HealthProfileService healthProfileService;

    @Test
    void updateProfile_Success() {
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail(email);

        HealthProfileRequest request = HealthProfileRequest.builder()
                .age(28)
                .gender("Male")
                .height(175.0)
                .weight(70.0)
                .bloodGroup("O+")
                .allergies("Peanuts")
                .existingConditions("None")
                .currentMedications("Vitamin D")
                .build();

        HealthProfile profile = new HealthProfile();
        profile.setId(10L);
        profile.setUser(user);
        profile.setAge(28);
        profile.setHeight(175.0);
        profile.setWeight(70.0);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(healthProfileRepository.findByUserEmail(email)).thenReturn(Optional.of(profile));
        when(healthProfileRepository.save(any(HealthProfile.class))).thenReturn(profile);

        HealthProfileResponse response = healthProfileService.updateProfileByUserEmail(email, request);

        assertNotNull(response);
        assertEquals(22.9, response.getBmi());
        assertEquals("Normal weight", response.getBmiCategory());
        verify(healthProfileRepository).save(any(HealthProfile.class));
    }

    @Test
    void calculateBmi_Success() {
        Double bmi = healthProfileService.calculateBmi(180.0, 80.0);
        assertEquals(24.7, bmi);

        String category = healthProfileService.determineBmiCategory(bmi);
        assertEquals("Normal weight", category);
    }
}
