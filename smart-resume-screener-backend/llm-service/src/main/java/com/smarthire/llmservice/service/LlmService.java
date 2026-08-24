package com.smarthire.llmservice.service;

import com.smarthire.llmservice.dto.LlmCandidateProfileDto;
import com.smarthire.llmservice.dto.LlmResumeRequestDto;
import com.smarthire.llmservice.dto.LlmJobRequestDto;
import com.smarthire.llmservice.dto.LlmJobRequirementsDto;

import com.smarthire.llmservice.dto.LlmScreeningRequestDto;
import com.smarthire.llmservice.dto.LlmScreeningResponseDto;

public interface LlmService {
    LlmCandidateProfileDto analyzeResume(LlmResumeRequestDto requestDto);
    LlmJobRequirementsDto analyzeJobDescription(LlmJobRequestDto requestDto);
    LlmScreeningResponseDto evaluateCandidate(LlmScreeningRequestDto requestDto);
}
