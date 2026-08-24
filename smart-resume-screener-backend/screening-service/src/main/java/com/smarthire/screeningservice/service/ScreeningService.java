package com.smarthire.screeningservice.service;

import com.smarthire.screeningservice.entity.ScreeningResult;
import java.util.List;

public interface ScreeningService {
    List<ScreeningResult> runScreeningForJob(Long jobId);
    ScreeningResult runScreeningForCandidate(Long jobId, Long resumeId);
    List<ScreeningResult> getScreeningResults(Long jobId);
    ScreeningResult getScreeningResultById(Long id);
    List<ScreeningResult> getAllScreeningResults();
}
