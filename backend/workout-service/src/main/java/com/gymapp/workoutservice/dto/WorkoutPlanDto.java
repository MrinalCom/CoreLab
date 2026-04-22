package com.gymapp.workoutservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkoutPlanDto {
    private String id;
    private String name;
    private String description;
    private String fitnessGoal;
    private String fitnessLevel;
    private Integer durationWeeks;
    private boolean aiGenerated;
    private List<WorkoutDayDto> days;
    private LocalDateTime createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class WorkoutDayDto {
        private String id;
        private Integer dayNumber;
        private String dayName;
        private String focus;
        private List<ExerciseDto> exercises;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ExerciseDto {
        private String id;
        private String name;
        private String muscleGroup;
        private Integer sets;
        private String reps;
        private Integer restSeconds;
        private String type;
        private String notes;
    }
}
