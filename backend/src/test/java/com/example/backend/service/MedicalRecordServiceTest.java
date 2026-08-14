package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.example.backend.dto.MedicalRecordResponse;
import com.example.backend.entity.DocumentType;
import com.example.backend.entity.MedicalRecord;
import com.example.backend.entity.User;
import com.example.backend.repository.MedicalRecordRepository;
import com.example.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class MedicalRecordServiceTest {

    @Mock
    private MedicalRecordRepository medicalRecordRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MedicalRecordService medicalRecordService;

    @Test
    void uploadRecord_Success() {
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(email);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "blood_test.pdf",
                "application/pdf",
                "PDF Content".getBytes()
        );

        MedicalRecord savedRecord = MedicalRecord.builder()
                .id(100L)
                .user(user)
                .fileName("blood_test.pdf")
                .fileType("application/pdf")
                .filePath("uploads/medical_records/test.pdf")
                .documentType(DocumentType.LAB_REPORT)
                .description("Routine blood check")
                .fileSize(file.getSize())
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenReturn(savedRecord);

        MedicalRecordResponse response = medicalRecordService.uploadRecord(email, file, DocumentType.LAB_REPORT, "Routine blood check");

        assertNotNull(response);
        assertEquals("blood_test.pdf", response.getFileName());
        assertEquals(DocumentType.LAB_REPORT, response.getDocumentType());
        verify(medicalRecordRepository).save(any(MedicalRecord.class));
    }

    @Test
    void uploadRecord_InvalidExtension_ThrowsException() {
        String email = "test@example.com";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "malicious.exe",
                "application/octet-stream",
                "EXE content".getBytes()
        );

        assertThrows(RuntimeException.class, () ->
                medicalRecordService.uploadRecord(email, file, DocumentType.OTHER, "Test")
        );
    }

    @Test
    void uploadRecord_PathTraversal_ThrowsException() {
        String email = "test@example.com";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "../../etc/passwd",
                "text/plain",
                "Sensitive Content".getBytes()
        );

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                medicalRecordService.uploadRecord(email, file, DocumentType.OTHER, "Path traversal attempt")
        );
        org.junit.jupiter.api.Assertions.assertTrue(
                exception.getMessage().contains("invalid path sequence") ||
                exception.getMessage().contains("outside target directory")
        );
    }
}
