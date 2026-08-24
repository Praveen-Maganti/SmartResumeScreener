package com.smarthire.screeningservice.client;
import com.smarthire.screeningservice.dto.ResumeResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "resume-service", url = "http://localhost:8082")
public interface ResumeServiceClient {
    @GetMapping("/resumes")
    List<ResumeResponseDto> getAllResumes();

    @GetMapping("/resumes/{id}")
    ResumeResponseDto getResumeById(@org.springframework.web.bind.annotation.PathVariable("id") Long id);
}
