package com.smarthire.llmservice.controller;

import com.smarthire.llmservice.dto.*;
import com.smarthire.llmservice.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    private final LlmService llmService;

    @Autowired
    public LlmController(LlmService llmService) {
        this.llmService = llmService;
    }

    @PostMapping("/analyze-resume")
    public ResponseEntity<LlmCandidateProfileDto> analyzeResume(@RequestBody LlmResumeRequestDto requestDto) {
        return ResponseEntity.ok(llmService.analyzeResume(requestDto));
    }

    @PostMapping("/analyze-job")
    public ResponseEntity<LlmJobRequirementsDto> analyzeJobDescription(@RequestBody LlmJobRequestDto requestDto) {
        return ResponseEntity.ok(llmService.analyzeJobDescription(requestDto));
    }

    @PostMapping("/screen")
    public ResponseEntity<LlmScreeningResponseDto> screenCandidate(@RequestBody LlmScreeningRequestDto requestDto) {
        return ResponseEntity.ok(llmService.evaluateCandidate(requestDto));
    }
}
