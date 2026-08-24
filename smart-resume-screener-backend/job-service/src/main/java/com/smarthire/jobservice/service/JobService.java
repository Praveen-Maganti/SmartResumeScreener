package com.smarthire.jobservice.service;

import com.smarthire.jobservice.dto.JobRequestDto;
import com.smarthire.jobservice.dto.JobResponseDto;
import java.util.List;

public interface JobService {
    JobResponseDto createJob(JobRequestDto jobRequestDto);
    List<JobResponseDto> getAllJobs();
    JobResponseDto getJobById(Long id);
}
