package com.example.backend.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.MedicalRecordResponse;
import com.example.backend.entity.DocumentType;
import com.example.backend.entity.MedicalRecord;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.MedicalRecordRepository;
import com.example.backend.repository.UserRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
@Getter
@Setter
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir:uploads/medical_records}")
    private String uploadDir = "uploads/medical_records";

    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "png", "jpg", "jpeg", "txt", "docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Transactional
    public MedicalRecordResponse uploadRecord(
            String userEmail,
            MultipartFile file,
            DocumentType documentType,
            String description) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum allowed limit of 10MB");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new RuntimeException("Filename contains invalid path sequence: " + originalFilename);
        }

        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new RuntimeException("File extension ." + fileExtension + " is not allowed. Allowed: " + ALLOWED_EXTENSIONS);
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        try {
            String targetDir = uploadDir != null ? uploadDir : "uploads/medical_records";
            Path rootLocation = Paths.get(targetDir).toAbsolutePath().normalize();
            Files.createDirectories(rootLocation);

            String storedFileName = UUID.randomUUID() + "_" + originalFilename;
            Path destinationFile = rootLocation.resolve(storedFileName).normalize();

            Path canonicalRootPath = rootLocation.toFile().getCanonicalFile().toPath();
            Path canonicalDestinationPath = destinationFile.toFile().getCanonicalFile().toPath();
            if (!canonicalDestinationPath.startsWith(canonicalRootPath)) {
                throw new RuntimeException("Cannot store file outside target directory: Path traversal attempt detected");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            MedicalRecord record = MedicalRecord.builder()
                    .user(user)
                    .fileName(originalFilename)
                    .fileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .filePath(destinationFile.toString())
                    .documentType(documentType != null ? documentType : DocumentType.OTHER)
                    .description(description)
                    .fileSize(file.getSize())
                    .build();

            MedicalRecord saved = medicalRecordRepository.save(record);
            return mapToResponse(saved);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getUserRecords(String userEmail) {
        return medicalRecordRepository.findByUserEmailOrderByUploadedAtDesc(userEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MedicalRecordResponse getRecordById(Long id, String userEmail) {
        MedicalRecord record = medicalRecordRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found or access denied for ID: " + id));
        return mapToResponse(record);
    }

    @Transactional(readOnly = true)
    public Resource loadRecordAsResource(Long id, String userEmail) {
        MedicalRecord record = medicalRecordRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found or access denied for ID: " + id));

        try {
            Path filePath = Paths.get(record.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + record.getFileName());
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read file: " + record.getFileName(), e);
        }
    }

    @Transactional
    public void deleteRecord(Long id, String userEmail) {
        MedicalRecord record = medicalRecordRepository.findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found or access denied for ID: " + id));

        try {
            Path filePath = Paths.get(record.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
        }

        medicalRecordRepository.delete(record);
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .userId(record.getUser().getId())
                .fileName(record.getFileName())
                .fileType(record.getFileType())
                .documentType(record.getDocumentType())
                .description(record.getDescription())
                .fileSize(record.getFileSize())
                .uploadedAt(record.getUploadedAt())
                .downloadUrl("/api/records/" + record.getId() + "/download")
                .build();
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastIndex = filename.lastIndexOf('.');
        return (lastIndex == -1) ? "" : filename.substring(lastIndex + 1);
    }
}
