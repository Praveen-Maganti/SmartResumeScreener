package com.smarthire.jobservice.service.impl;

import com.smarthire.jobservice.client.LlmServiceClient;
import com.smarthire.jobservice.dto.JobRequestDto;
import com.smarthire.jobservice.dto.JobResponseDto;
import com.smarthire.jobservice.dto.LlmJobRequestDto;
import com.smarthire.jobservice.dto.LlmJobRequirementsDto;
import com.smarthire.jobservice.entity.Job;
import com.smarthire.jobservice.exception.ResourceNotFoundException;
import com.smarthire.jobservice.repository.JobRepository;
import com.smarthire.jobservice.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final LlmServiceClient llmServiceClient;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, LlmServiceClient llmServiceClient) {
        this.jobRepository = jobRepository;
        this.llmServiceClient = llmServiceClient;
    }

    @Override
    public JobResponseDto createJob(JobRequestDto jobRequestDto) {
        // Call LLM Service via OpenFeign
        LlmJobRequirementsDto requirements = llmServiceClient.analyzeJobDescription(new LlmJobRequestDto(jobRequestDto.getDescription()));

        Job job = new Job();
        job.setTitle(jobRequestDto.getTitle());
        job.setDescription(jobRequestDto.getDescription());
        job.setCompanyName(jobRequestDto.getCompanyName() != null ? jobRequestDto.getCompanyName() : "Internal");
        job.setLocation(jobRequestDto.getLocation() != null ? jobRequestDto.getLocation() : "Remote");
        job.setWorkMode(jobRequestDto.getWorkMode() != null ? jobRequestDto.getWorkMode() : "Hybrid");
        job.setSalaryRange(jobRequestDto.getSalaryRange() != null ? jobRequestDto.getSalaryRange() : "Market Rate");
        job.setExperienceLevel(jobRequestDto.getExperienceLevel() != null ? jobRequestDto.getExperienceLevel() : "Mid-Level");
        job.setMinExperience(jobRequestDto.getMinExperience() != null ? jobRequestDto.getMinExperience() : 2);
        job.setMinEducation(jobRequestDto.getMinEducation() != null ? jobRequestDto.getMinEducation() : "Bachelor's");
        job.setStatus("Active");
        
        job.setRequiredSkills(requirements.getRequiredSkills());
        job.setPreferredSkills(requirements.getPreferredSkills());
        
        Job savedJob = jobRepository.save(job);
        return mapToDto(savedJob);
    }

    @Override
    public List<JobResponseDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobResponseDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToDto(job);
    }

    private JobResponseDto mapToDto(Job job) {
        JobResponseDto dto = new JobResponseDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompanyName(job.getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setWorkMode(job.getWorkMode());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setStatus(job.getStatus());
        dto.setMinExperience(job.getMinExperience());
        dto.setMinEducation(job.getMinEducation());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setPreferredSkills(job.getPreferredSkills());
        dto.setCreatedAt(job.getCreatedAt());
        
        dto.setCandidatesScreened(0);
        dto.setAvgScore(0);
        return dto;
    }
}
