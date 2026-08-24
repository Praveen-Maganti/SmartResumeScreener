package com.smarthire.screeningservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screening_results")
public class ScreeningResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long jobId;
    private Long resumeId;
    private String candidateName;
    private int score;
    @Column(length = 2048)
    private String matchDetails;
    
    @Column(length = 2048)
    private String strengths;
    
    @Column(length = 2048)
    private String weaknesses;
    
    @Column(length = 2048)
    private String improvementSuggestions;

    @Column(length = 2048)
    private String unfitReasons;
    
    private String recommendation;
    private LocalDateTime screenedAt;

    @PrePersist
    protected void onCreate() { screenedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getMatchDetails() { return matchDetails; }
    public void setMatchDetails(String matchDetails) { this.matchDetails = matchDetails; }
    
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    
    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }
    
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    
    public LocalDateTime getScreenedAt() { return screenedAt; }
    public void setScreenedAt(LocalDateTime screenedAt) { this.screenedAt = screenedAt; }

    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public String getUnfitReasons() { return unfitReasons; }
    public void setUnfitReasons(String unfitReasons) { this.unfitReasons = unfitReasons; }
}
