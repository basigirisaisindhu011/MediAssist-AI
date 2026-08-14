package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiProxyController {

    @Value("${ai.service.url:http://localhost:8000/api/v1}")
    private String aiServiceBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/analyze-symptoms")
    public ResponseEntity<String> analyzeSymptoms(@RequestBody String requestBody) {
        return proxyPost("/symptoms/analyze", requestBody);
    }

    @PostMapping("/risk-score")
    public ResponseEntity<String> calculateRiskScore(@RequestBody String requestBody) {
        return proxyPost("/health/risk-score", requestBody);
    }

    @PostMapping("/summarize-report")
    public ResponseEntity<String> summarizeReport(@RequestBody String requestBody) {
        return proxyPost("/documents/summarize", requestBody);
    }

    private ResponseEntity<String> proxyPost(String endpoint, String requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        String url = aiServiceBaseUrl + endpoint;
        return restTemplate.postForEntity(url, entity, String.class);
    }
}
