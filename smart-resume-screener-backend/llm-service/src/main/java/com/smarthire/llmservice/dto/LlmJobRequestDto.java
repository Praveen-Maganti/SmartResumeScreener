package com.smarthire.llmservice.dto;

public class LlmJobRequestDto {
    private String jobDescription;

    public LlmJobRequestDto() {
    }

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
