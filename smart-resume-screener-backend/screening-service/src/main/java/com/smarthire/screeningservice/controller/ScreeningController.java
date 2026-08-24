package com.smarthire.screeningservice.controller;

import com.smarthire.screeningservice.entity.ScreeningResult;
import com.smarthire.screeningservice.service.ScreeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/screening")
public class ScreeningController {

    private final ScreeningService screeningService;

    @Autowired
    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<List<ScreeningResult>> runScreening(@PathVariable Long jobId) {
        return ResponseEntity.ok(screeningService.runScreeningForJob(jobId));
    }

    @PostMapping("/{jobId}/{resumeId}")
    public ResponseEntity<ScreeningResult> runSingleScreening(@PathVariable Long jobId, @PathVariable Long resumeId) {
        return ResponseEntity.ok(screeningService.runScreeningForCandidate(jobId, resumeId));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<List<ScreeningResult>> getScreeningResults(@PathVariable Long jobId) {
        return ResponseEntity.ok(screeningService.getScreeningResults(jobId));
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<ScreeningResult> getScreeningResultById(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreeningResultById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ScreeningResult>> getAllScreeningResults() {
        return ResponseEntity.ok(screeningService.getAllScreeningResults());
    }
}
