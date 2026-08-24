package com.smarthire.screeningservice.repository;

import com.smarthire.screeningservice.entity.ScreeningResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScreeningResultRepository extends JpaRepository<ScreeningResult, Long> {
    List<ScreeningResult> findByJobIdOrderByScoreDesc(Long jobId);
    ScreeningResult findByJobIdAndResumeId(Long jobId, Long resumeId);
}
