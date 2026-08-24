package com.smarthire.jobservice.dto;

import java.time.LocalDateTime;
import java.util.List;

public class JobResponseDto {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String workMode;
    private String salaryRange;
    private String experienceLevel;
    private String status;
    private Integer minExperience;
    private String minEducation;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private LocalDateTime createdAt;
    private Integer candidatesScreened = 0;
    private Integer avgScore = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }
    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getMinExperience() { return minExperience; }
    public void setMinExperience(Integer minExperience) { this.minExperience = minExperience; }
    public String getMinEducation() { return minEducation; }
    public void setMinEducation(String minEducation) { this.minEducation = minEducation; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public List<String> getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(List<String> preferredSkills) { this.preferredSkills = preferredSkills; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Integer getCandidatesScreened() { return candidatesScreened; }
    public void setCandidatesScreened(Integer candidatesScreened) { this.candidatesScreened = candidatesScreened; }
    public Integer getAvgScore() { return avgScore; }
    public void setAvgScore(Integer avgScore) { this.avgScore = avgScore; }
}
