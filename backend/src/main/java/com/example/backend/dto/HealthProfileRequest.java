package com.example.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileRequest {

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age must be realistic")
    private Integer age;

    private String gender;

    @Min(value = 30, message = "Height must be at least 30 cm")
    @Max(value = 300, message = "Height must be realistic")
    private Double height; // cm

    @Min(value = 1, message = "Weight must be at least 1 kg")
    @Max(value = 500, message = "Weight must be realistic")
    private Double weight; // kg

    private String bloodGroup;

    private String allergies;

    private String existingConditions;

    private String currentMedications;

    private String emergencyContact;

    private String emergencyContactName;

    private String emergencyContactPhone;
}
