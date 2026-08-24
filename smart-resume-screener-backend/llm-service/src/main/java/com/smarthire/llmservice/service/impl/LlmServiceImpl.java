package com.smarthire.llmservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthire.llmservice.dto.*;
import com.smarthire.llmservice.service.LlmService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LlmServiceImpl implements LlmService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LlmServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    private String callGemini(String prompt) {
        if (apiKey == null || apiKey.contains("your_api_key_here") || apiKey.isEmpty()) {
            throw new RuntimeException("Gemini API Key is not configured in application.yml!");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Arrays.asList(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Arrays.asList(content));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String url = apiUrl + "?key=" + apiKey;
            Map response = restTemplate.postForObject(url, request, Map.class);
            
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> firstCandidate = candidates.get(0);
                Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Gemini API: " + e.getMessage(), e);
        }
    }

    @Override
    public LlmCandidateProfileDto analyzeResume(LlmResumeRequestDto requestDto) {
        String text = requestDto.getRawText() != null ? requestDto.getRawText() : "";
        
        String prompt = "You are an expert technical recruiter AI. Extract the following information from this resume. " +
                "Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: \n" +
                "{ \"candidateName\": \"string\", \"skills\": [\"skill1\", \"skill2\"], \"yearsOfExperience\": number, \"educationLevel\": \"string\" }\n\n" +
                "Resume:\n" + text;

        try {
            String response = callGemini(prompt);
            response = response.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(response, LlmCandidateProfileDto.class);
        } catch (Exception e) {
            System.err.println("Gemini Error: " + e.getMessage());
            throw new RuntimeException("LLM Analysis failed: " + e.getMessage());
        }
    }

    @Override
    public LlmJobRequirementsDto analyzeJobDescription(LlmJobRequestDto requestDto) {
        String desc = requestDto.getJobDescription() != null ? requestDto.getJobDescription() : "";
        
        String prompt = "You are an expert technical recruiter AI. Analyze this job description and extract required and preferred skills. " +
                "Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: \n" +
                "{ \"requiredSkills\": [\"skill1\"], \"preferredSkills\": [\"skill2\"] }\n\n" +
                "Job Description:\n" + desc;

        try {
            String response = callGemini(prompt);
            response = response.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(response, LlmJobRequirementsDto.class);
        } catch (Exception e) {
            System.err.println("Gemini Error: " + e.getMessage());
            throw new RuntimeException("LLM Analysis failed: " + e.getMessage());
        }
    }

    @Override
    public LlmScreeningResponseDto evaluateCandidate(LlmScreeningRequestDto requestDto) {
        String jobDesc = requestDto.getJobDescription() != null ? requestDto.getJobDescription() : "";
        String jobSkills = requestDto.getJobSkills() != null ? requestDto.getJobSkills().toString() : "";
        String resume = requestDto.getResumeText() != null ? requestDto.getResumeText() : "";
        
        String prompt = "You are an expert technical recruiter AI. Evaluate this candidate against the job requirements. " +
                "Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: \n" +
                "{ \"score\": number (0-100), \"strengths\": [\"strength1\"], \"weaknesses\": [\"weakness1\"], \"improvementSuggestions\": [\"suggestion1\"], \"unfitReasons\": [\"reason1\"], \"recommendation\": \"STRONG SHORTLIST\" or \"SHORTLIST\" or \"REVIEW\", \"summary\": \"string\" }\n\n" +
                "Job Description:\n" + jobDesc + "\n" +
                "Required Skills:\n" + jobSkills + "\n\n" +
                "Candidate Resume:\n" + resume;

        try {
            String response = callGemini(prompt);
            response = response.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(response, LlmScreeningResponseDto.class);
        } catch (Exception e) {
            System.err.println("Gemini Error: " + e.getMessage());
            throw new RuntimeException("LLM Analysis failed: " + e.getMessage());
        }
    }
}
