package com.smarthire.resumeservice.dto;

public class LlmResumeRequestDto {
    private String rawText;

    public LlmResumeRequestDto(String rawText) {
        this.rawText = rawText;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
}
