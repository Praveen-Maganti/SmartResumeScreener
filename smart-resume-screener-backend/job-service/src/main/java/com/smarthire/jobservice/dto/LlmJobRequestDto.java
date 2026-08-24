package com.smarthire.jobservice.dto;

public class LlmJobRequestDto {
    private String jobDescription;

    public LlmJobRequestDto(String jobDescription) { 
        this.jobDescription = jobDescription; 
    }
    
    public String getJobDescription() { 
        return jobDescription; 
    }
    
    public void setJobDescription(String jobDescription) { 
        this.jobDescription = jobDescription; 
    }
}
