package com.smarthire.llmservice.dto;

import java.util.List;

public class LlmScreeningResponseDto {
    private int score;
    private List<String> strengths;
    private List<String> weaknesses;
    private String recommendation;
    private String summary;
    private List<String> improvementSuggestions;
    private List<String> unfitReasons;

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(List<String> improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public List<String> getUnfitReasons() { return unfitReasons; }
    public void setUnfitReasons(List<String> unfitReasons) { this.unfitReasons = unfitReasons; }
}
