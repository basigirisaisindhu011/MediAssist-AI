package com.example.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.MedicalRecordResponse;
import com.example.backend.entity.DocumentType;
import com.example.backend.service.MedicalRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping("/upload")
    public ResponseEntity<MedicalRecordResponse> uploadRecord(
            Principal principal,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", required = false, defaultValue = "OTHER") DocumentType documentType,
            @RequestParam(value = "description", required = false) String description) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(medicalRecordService.uploadRecord(userEmail, file, documentType, description));
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getUserRecords(Principal principal) {
        String userEmail = principal.getName();
        return ResponseEntity.ok(medicalRecordService.getUserRecords(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getRecordById(
            Principal principal,
            @PathVariable Long id) {

        String userEmail = principal.getName();
        return ResponseEntity.ok(medicalRecordService.getRecordById(id, userEmail));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadRecord(
            Principal principal,
            @PathVariable Long id) {

        String userEmail = principal.getName();
        MedicalRecordResponse record = medicalRecordService.getRecordById(id, userEmail);
        Resource resource = medicalRecordService.loadRecordAsResource(id, userEmail);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(record.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + record.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(
            Principal principal,
            @PathVariable Long id) {

        String userEmail = principal.getName();
        medicalRecordService.deleteRecord(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}
