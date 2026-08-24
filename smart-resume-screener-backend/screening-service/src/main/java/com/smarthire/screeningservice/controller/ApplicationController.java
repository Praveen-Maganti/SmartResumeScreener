package com.smarthire.screeningservice.controller;

import com.smarthire.screeningservice.dto.ApplicationRequestDto;
import com.smarthire.screeningservice.dto.StageUpdateRequestDto;
import com.smarthire.screeningservice.entity.JobApplication;
import com.smarthire.screeningservice.repository.JobApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/screening/applications")
public class ApplicationController {

    private final JobApplicationRepository repository;

    public ApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/apply")
    public ResponseEntity<JobApplication> applyForJob(@RequestBody ApplicationRequestDto request) {
        JobApplication existingApp = repository.findByJobIdAndCandidateId(request.getJobId(), request.getCandidateId());
        if (existingApp != null) {
            existingApp.setResumeId(request.getResumeId());
            existingApp.setStatus("APPLIED");
            return ResponseEntity.ok(repository.save(existingApp));
        }

        JobApplication application = new JobApplication();
        application.setJobId(request.getJobId());
        application.setCandidateId(request.getCandidateId());
        application.setResumeId(request.getResumeId());
        application.setStatus("APPLIED");
        
        JobApplication saved = repository.save(application);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplication>> getCandidateApplications(@PathVariable Long candidateId) {
        return ResponseEntity.ok(repository.findByCandidateId(candidateId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(repository.findByJobId(jobId));
    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<JobApplication> updateApplicationStage(@PathVariable Long id, @RequestBody StageUpdateRequestDto request) {
        JobApplication application = repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(request.getStatus());
        return ResponseEntity.ok(repository.save(application));
    }

    @PutMapping("/job/{jobId}/resume/{resumeId}/stage")
    public ResponseEntity<JobApplication> updateStageByResume(@PathVariable Long jobId, @PathVariable Long resumeId, @RequestBody StageUpdateRequestDto request) {
        JobApplication application = repository.findByJobIdAndResumeId(jobId, resumeId);
        if (application == null) {
            return ResponseEntity.notFound().build();
        }
        application.setStatus(request.getStatus());
        return ResponseEntity.ok(repository.save(application));
    }
}
