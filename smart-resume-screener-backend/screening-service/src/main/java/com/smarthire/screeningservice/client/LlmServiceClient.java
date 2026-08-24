package com.smarthire.screeningservice.client;

import com.smarthire.screeningservice.dto.LlmScreeningRequestDto;
import com.smarthire.screeningservice.dto.LlmScreeningResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "llm-service", url = "http://localhost:8084")
public interface LlmServiceClient {
    @PostMapping("/api/llm/screen")
    LlmScreeningResponseDto screenCandidate(@RequestBody LlmScreeningRequestDto requestDto);
}
