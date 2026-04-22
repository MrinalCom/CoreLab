package com.gymapp.trackingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SessionDto {
    private String id;
    private String workoutPlanId;
    private String workoutDayId;
    private String workoutName;
    private LocalDate sessionDate;
    private Integer durationMinutes;
    private String notes;
    private String status;
    private List<ExerciseLogDto> exerciseLogs;
    private LocalDateTime createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ExerciseLogDto {
        private String id;
        private String exerciseName;
        private String exerciseId;
        private List<SetLogDto> sets;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SetLogDto {
        private String id;
        private Integer setNumber;
        private Integer reps;
        private Double weight;
        private Integer durationSeconds;
        private Boolean completed;
    }
}
