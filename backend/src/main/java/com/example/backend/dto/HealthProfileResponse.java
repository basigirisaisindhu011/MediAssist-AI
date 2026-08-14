package com.example.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private Double bmi;
    private String bmiCategory;
    private String bloodGroup;
    private String allergies;
    private String existingConditions;
    private String currentMedications;
    private String emergencyContact;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
