package com.smarthire.llmservice.dto;

import java.util.List;

public class LlmJobRequirementsDto {
    private List<String> requiredSkills;
    private List<String> preferredSkills;

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<String> getPreferredSkills() {
        return preferredSkills;
    }

    public void setPreferredSkills(List<String> preferredSkills) {
        this.preferredSkills = preferredSkills;
    }
}
