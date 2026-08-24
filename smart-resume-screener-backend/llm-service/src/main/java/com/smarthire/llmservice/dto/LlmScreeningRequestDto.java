package com.smarthire.llmservice.dto;

import java.util.List;

public class LlmScreeningRequestDto {
    private String jobDescription;
    private List<String> jobSkills;
    private String resumeText;

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    
    public List<String> getJobSkills() { return jobSkills; }
    public void setJobSkills(List<String> jobSkills) { this.jobSkills = jobSkills; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }
}
