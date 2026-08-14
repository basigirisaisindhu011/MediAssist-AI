package com.example.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.HealthProfileRequest;
import com.example.backend.dto.HealthProfileResponse;
import com.example.backend.entity.HealthProfile;
import com.example.backend.entity.User;
import com.example.backend.repository.HealthProfileRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HealthProfileService {

    private final HealthProfileRepository healthProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public HealthProfileResponse getProfileByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        HealthProfile profile = healthProfileRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    HealthProfile newProfile = new HealthProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        return mapToResponse(user, profile);
    }

    @Transactional
    public HealthProfileResponse updateProfileByUserEmail(String userEmail, HealthProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        HealthProfile profile = healthProfileRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    HealthProfile newProfile = new HealthProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setAllergies(request.getAllergies());
        profile.setExistingConditions(request.getExistingConditions());
        profile.setCurrentMedications(request.getCurrentMedications());
        profile.setEmergencyContact(request.getEmergencyContact());
        profile.setEmergencyContactName(request.getEmergencyContactName());
        profile.setEmergencyContactPhone(request.getEmergencyContactPhone());

        HealthProfile savedProfile = healthProfileRepository.save(profile);
        return mapToResponse(user, savedProfile);
    }

    private HealthProfileResponse mapToResponse(User user, HealthProfile profile) {
        Double bmi = calculateBmi(profile.getHeight(), profile.getWeight());
        String bmiCategory = determineBmiCategory(bmi);

        return HealthProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .age(profile.getAge())
                .gender(profile.getGender())
                .height(profile.getHeight())
                .weight(profile.getWeight())
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .bloodGroup(profile.getBloodGroup())
                .allergies(profile.getAllergies())
                .existingConditions(profile.getExistingConditions())
                .currentMedications(profile.getCurrentMedications())
                .emergencyContact(profile.getEmergencyContact())
                .emergencyContactName(profile.getEmergencyContactName())
                .emergencyContactPhone(profile.getEmergencyContactPhone())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    public Double calculateBmi(Double heightCm, Double weightKg) {
        if (heightCm == null || weightKg == null || heightCm <= 0 || weightKg <= 0) {
            return null;
        }
        double heightM = heightCm / 100.0;
        double bmi = weightKg / (heightM * heightM);
        return Math.round(bmi * 10.0) / 10.0;
    }

    public String determineBmiCategory(Double bmi) {
        if (bmi == null) {
            return "N/A";
        }
        if (bmi < 18.5) {
            return "Underweight";
        } else if (bmi < 25.0) {
            return "Normal weight";
        } else if (bmi < 30.0) {
            return "Overweight";
        } else {
            return "Obese";
        }
    }
}
