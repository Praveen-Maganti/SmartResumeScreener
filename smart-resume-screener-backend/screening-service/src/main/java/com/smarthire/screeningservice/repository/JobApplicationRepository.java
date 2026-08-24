package com.smarthire.screeningservice.repository;

import com.smarthire.screeningservice.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidateId(Long candidateId);
    List<JobApplication> findByJobId(Long jobId);
    JobApplication findByJobIdAndCandidateId(Long jobId, Long candidateId);
    JobApplication findByJobIdAndResumeId(Long jobId, Long resumeId);
}
