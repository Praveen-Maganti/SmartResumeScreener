package com.smarthire.screeningservice.client;
import com.smarthire.screeningservice.dto.JobResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-service", url = "http://localhost:8081")
public interface JobServiceClient {
    @GetMapping("/jobs/{id}")
    JobResponseDto getJobById(@PathVariable("id") Long id);
}
