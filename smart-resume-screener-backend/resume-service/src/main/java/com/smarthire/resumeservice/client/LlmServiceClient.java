package com.smarthire.resumeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.smarthire.resumeservice.dto.LlmResumeRequestDto;
import com.smarthire.resumeservice.dto.LlmCandidateProfileDto;

@FeignClient(name = "llm-service", url = "http://localhost:8084")
public interface LlmServiceClient {
    
    @PostMapping("/api/llm/analyze-resume")
    LlmCandidateProfileDto analyzeResume(@RequestBody LlmResumeRequestDto requestDto);
}
