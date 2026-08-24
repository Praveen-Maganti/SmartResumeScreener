package com.smarthire.screeningservice.dto;
import java.util.List;

public class JobResponseDto {
    private Long id;
    private String title;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private String description;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public List<String> getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(List<String> preferredSkills) { this.preferredSkills = preferredSkills; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
