package com.smarthire.jobservice.client;

import com.smarthire.jobservice.dto.LlmJobRequestDto;
import com.smarthire.jobservice.dto.LlmJobRequirementsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "llm-service", url = "http://localhost:8084")
public interface LlmServiceClient {
    
    @PostMapping("/api/llm/analyze-job")
    LlmJobRequirementsDto analyzeJobDescription(@RequestBody LlmJobRequestDto requestDto);
}
