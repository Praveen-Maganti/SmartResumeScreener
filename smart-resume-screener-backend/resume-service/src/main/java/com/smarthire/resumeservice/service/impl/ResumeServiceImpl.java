package com.smarthire.resumeservice.service.impl;

import com.smarthire.resumeservice.client.LlmServiceClient;
import com.smarthire.resumeservice.dto.LlmCandidateProfileDto;
import com.smarthire.resumeservice.dto.LlmResumeRequestDto;
import com.smarthire.resumeservice.dto.ResumeUploadResponseDto;
import com.smarthire.resumeservice.entity.Resume;
import com.smarthire.resumeservice.repository.ResumeRepository;
import com.smarthire.resumeservice.service.PdfExtractionService;
import com.smarthire.resumeservice.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final PdfExtractionService pdfExtractionService;
    private final ResumeRepository resumeRepository;
    private final LlmServiceClient llmServiceClient;

    @Autowired
    public ResumeServiceImpl(PdfExtractionService pdfExtractionService, 
                             ResumeRepository resumeRepository,
                             LlmServiceClient llmServiceClient) {
        this.pdfExtractionService = pdfExtractionService;
        this.resumeRepository = resumeRepository;
        this.llmServiceClient = llmServiceClient;
    }

    @Override
    public ResumeUploadResponseDto uploadAndExtractResume(MultipartFile file) throws IOException {
        String extractedText = pdfExtractionService.extractTextFromPdf(file);

        // Call LLM Service via OpenFeign
        LlmCandidateProfileDto profileDto = llmServiceClient.analyzeResume(new LlmResumeRequestDto(extractedText));

        Resume resume = new Resume();
        resume.setOriginalFilename(file.getOriginalFilename());
        resume.setRawText(extractedText);
        
        // Map structured fields from the LLM
        resume.setCandidateName(profileDto.getCandidateName());
        resume.setSkills(profileDto.getSkills());
        resume.setYearsOfExperience(profileDto.getYearsOfExperience());
        resume.setEducationLevel(profileDto.getEducationLevel());

        Resume savedResume = resumeRepository.save(resume);

        ResumeUploadResponseDto response = new ResumeUploadResponseDto();
        response.setId(savedResume.getId());
        response.setOriginalFilename(savedResume.getOriginalFilename());
        response.setRawText(savedResume.getRawText());

        return response;
    }

    @Override
    public java.util.List<com.smarthire.resumeservice.dto.ResumeResponseDto> getAllResumes() {
        return resumeRepository.findAll().stream().map(resume -> {
            com.smarthire.resumeservice.dto.ResumeResponseDto dto = new com.smarthire.resumeservice.dto.ResumeResponseDto();
            dto.setId(resume.getId());
            dto.setCandidateName(resume.getCandidateName());
            dto.setSkills(resume.getSkills());
            dto.setYearsOfExperience(resume.getYearsOfExperience());
            dto.setEducationLevel(resume.getEducationLevel());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public com.smarthire.resumeservice.dto.ResumeResponseDto getResumeById(Long id) {
        Resume resume = resumeRepository.findById(id).orElseThrow(() -> new RuntimeException("Resume not found"));
        com.smarthire.resumeservice.dto.ResumeResponseDto dto = new com.smarthire.resumeservice.dto.ResumeResponseDto();
        dto.setId(resume.getId());
        dto.setCandidateName(resume.getCandidateName());
        dto.setSkills(resume.getSkills());
        dto.setYearsOfExperience(resume.getYearsOfExperience());
        dto.setEducationLevel(resume.getEducationLevel());
        return dto;
    }
}
