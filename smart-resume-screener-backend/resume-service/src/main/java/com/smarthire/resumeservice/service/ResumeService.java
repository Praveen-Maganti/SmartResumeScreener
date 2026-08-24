package com.smarthire.resumeservice.service;

import com.smarthire.resumeservice.dto.ResumeUploadResponseDto;
import com.smarthire.resumeservice.dto.ResumeResponseDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ResumeService {
    ResumeUploadResponseDto uploadAndExtractResume(MultipartFile file) throws IOException;
    List<ResumeResponseDto> getAllResumes();
    ResumeResponseDto getResumeById(Long id);
}
