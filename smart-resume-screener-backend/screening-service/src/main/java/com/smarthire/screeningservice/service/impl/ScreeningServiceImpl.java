package com.smarthire.screeningservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthire.screeningservice.client.JobServiceClient;
import com.smarthire.screeningservice.client.LlmServiceClient;
import com.smarthire.screeningservice.client.ResumeServiceClient;
import com.smarthire.screeningservice.dto.JobResponseDto;
import com.smarthire.screeningservice.dto.LlmScreeningRequestDto;
import com.smarthire.screeningservice.dto.LlmScreeningResponseDto;
import com.smarthire.screeningservice.dto.ResumeResponseDto;
import com.smarthire.screeningservice.entity.ScreeningResult;
import com.smarthire.screeningservice.repository.ScreeningResultRepository;
import com.smarthire.screeningservice.service.ScreeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScreeningServiceImpl implements ScreeningService {

    private final JobServiceClient jobServiceClient;
    private final ResumeServiceClient resumeServiceClient;
    private final LlmServiceClient llmServiceClient;
    private final ScreeningResultRepository repository;

    @Autowired
    public ScreeningServiceImpl(JobServiceClient jobServiceClient, ResumeServiceClient resumeServiceClient, LlmServiceClient llmServiceClient, ScreeningResultRepository repository) {
        this.jobServiceClient = jobServiceClient;
        this.resumeServiceClient = resumeServiceClient;
        this.llmServiceClient = llmServiceClient;
        this.repository = repository;
    }

    @Override
    public List<ScreeningResult> runScreeningForJob(Long jobId) {
        JobResponseDto job = jobServiceClient.getJobById(jobId);
        List<ResumeResponseDto> resumes = resumeServiceClient.getAllResumes();
        
        List<ScreeningResult> oldResults = repository.findByJobIdOrderByScoreDesc(jobId);
        repository.deleteAll(oldResults);

        ObjectMapper objectMapper = new ObjectMapper();
        List<ScreeningResult> newResults = resumes.stream().map(resume -> {
            LlmScreeningRequestDto requestDto = new LlmScreeningRequestDto();
            requestDto.setJobDescription(job.getDescription());
            requestDto.setJobSkills(job.getRequiredSkills());
            requestDto.setResumeText("Candidate Name: " + resume.getCandidateName() + 
                                     "\nExperience: " + resume.getYearsOfExperience() + " years" +
                                     "\nEducation: " + resume.getEducationLevel() +
                                     "\nSkills: " + (resume.getSkills() != null ? resume.getSkills().toString() : ""));
            
            LlmScreeningResponseDto aiResponse = llmServiceClient.screenCandidate(requestDto);

            ScreeningResult result = new ScreeningResult();
            result.setJobId(jobId);
            result.setResumeId(resume.getId());
            result.setCandidateName(resume.getCandidateName());
            result.setScore(aiResponse.getScore());
            result.setMatchDetails(aiResponse.getSummary() != null ? aiResponse.getSummary() : "No summary provided.");
            try {
                result.setStrengths(aiResponse.getStrengths() != null ? objectMapper.writeValueAsString(aiResponse.getStrengths()) : "[]");
                result.setWeaknesses(aiResponse.getWeaknesses() != null ? objectMapper.writeValueAsString(aiResponse.getWeaknesses()) : "[]");
                result.setImprovementSuggestions(aiResponse.getImprovementSuggestions() != null ? objectMapper.writeValueAsString(aiResponse.getImprovementSuggestions()) : "[]");
                result.setUnfitReasons(aiResponse.getUnfitReasons() != null ? objectMapper.writeValueAsString(aiResponse.getUnfitReasons()) : "[]");
            } catch (Exception e) {
                result.setStrengths("[]");
                result.setWeaknesses("[]");
                result.setImprovementSuggestions("[]");
                result.setUnfitReasons("[]");
            }
            result.setRecommendation(aiResponse.getRecommendation() != null ? aiResponse.getRecommendation() : "REVIEW");
            return result;
        }).collect(Collectors.toList());

        repository.saveAll(newResults);
        return repository.findByJobIdOrderByScoreDesc(jobId);
    }

    @Override
    public ScreeningResult runScreeningForCandidate(Long jobId, Long resumeId) {
        JobResponseDto job = jobServiceClient.getJobById(jobId);
        ResumeResponseDto resume = resumeServiceClient.getResumeById(resumeId);
        
        ScreeningResult oldResult = repository.findByJobIdAndResumeId(jobId, resumeId);
        if (oldResult != null) {
            repository.delete(oldResult);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        LlmScreeningRequestDto requestDto = new LlmScreeningRequestDto();
        requestDto.setJobDescription(job.getDescription());
        requestDto.setJobSkills(job.getRequiredSkills());
        requestDto.setResumeText("Candidate Name: " + resume.getCandidateName() + 
                                 "\nExperience: " + resume.getYearsOfExperience() + " years" +
                                 "\nEducation: " + resume.getEducationLevel() +
                                 "\nSkills: " + (resume.getSkills() != null ? resume.getSkills().toString() : ""));
        
        LlmScreeningResponseDto aiResponse = llmServiceClient.screenCandidate(requestDto);

        ScreeningResult result = new ScreeningResult();
        result.setJobId(jobId);
        result.setResumeId(resume.getId());
        result.setCandidateName(resume.getCandidateName());
        result.setScore(aiResponse.getScore());
        result.setMatchDetails(aiResponse.getSummary() != null ? aiResponse.getSummary() : "No summary provided.");
        try {
            result.setStrengths(aiResponse.getStrengths() != null ? objectMapper.writeValueAsString(aiResponse.getStrengths()) : "[]");
            result.setWeaknesses(aiResponse.getWeaknesses() != null ? objectMapper.writeValueAsString(aiResponse.getWeaknesses()) : "[]");
            result.setImprovementSuggestions(aiResponse.getImprovementSuggestions() != null ? objectMapper.writeValueAsString(aiResponse.getImprovementSuggestions()) : "[]");
            result.setUnfitReasons(aiResponse.getUnfitReasons() != null ? objectMapper.writeValueAsString(aiResponse.getUnfitReasons()) : "[]");
        } catch (Exception e) {
            result.setStrengths("[]");
            result.setWeaknesses("[]");
            result.setImprovementSuggestions("[]");
            result.setUnfitReasons("[]");
        }
        result.setRecommendation(aiResponse.getRecommendation() != null ? aiResponse.getRecommendation() : "REVIEW");
        
        return repository.save(result);
    }

    @Override
    public List<ScreeningResult> getScreeningResults(Long jobId) {
        return repository.findByJobIdOrderByScoreDesc(jobId);
    }

    @Override
    public ScreeningResult getScreeningResultById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Result not found"));
    }

    @Override
    public List<ScreeningResult> getAllScreeningResults() {
        return repository.findAll();
    }

    private int calculateScore(JobResponseDto job, ResumeResponseDto resume) {
        if (job.getRequiredSkills() == null || job.getRequiredSkills().isEmpty()) return 50;
        if (resume.getSkills() == null || resume.getSkills().isEmpty()) return 10;
        
        long matches = resume.getSkills().stream()
            .filter(skill -> job.getRequiredSkills().contains(skill))
            .count();
            
        double percentage = (double) matches / job.getRequiredSkills().size();
        return (int) (percentage * 100);
    }
}
