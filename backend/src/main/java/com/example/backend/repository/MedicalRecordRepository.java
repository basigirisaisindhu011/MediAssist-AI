package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByUserEmailOrderByUploadedAtDesc(String email);

    Optional<MedicalRecord> findByIdAndUserEmail(Long id, String email);
}
