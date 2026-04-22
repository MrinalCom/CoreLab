package com.gymapp.trackingservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateSessionRequest {
    private String workoutPlanId;
    private String workoutDayId;
    private String workoutName;

    @NotNull
    private LocalDate sessionDate;

    private String notes;
}
