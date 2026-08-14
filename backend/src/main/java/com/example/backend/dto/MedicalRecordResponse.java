package com.example.backend.dto;

import java.time.LocalDateTime;

import com.example.backend.entity.DocumentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {

    private Long id;
    private Long userId;
    private String fileName;
    private String fileType;
    private DocumentType documentType;
    private String description;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private String downloadUrl;
}
