package com.gymapp.workoutservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GeneratePlanRequest {

    @NotBlank
    private String fitnessGoal;

    @NotBlank
    private String fitnessLevel;

    @Min(1) @Max(7)
    private Integer daysPerWeek = 3;

    private String equipment = "basic gym equipment";
}
