package com.gymapp.workoutservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymapp.workoutservice.ai.ClaudeAiService;
import com.gymapp.workoutservice.dto.GeneratePlanRequest;
import com.gymapp.workoutservice.dto.WorkoutPlanDto;
import com.gymapp.workoutservice.model.Exercise;
import com.gymapp.workoutservice.model.WorkoutDay;
import com.gymapp.workoutservice.model.WorkoutPlan;
import com.gymapp.workoutservice.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutService {

    private final WorkoutPlanRepository planRepository;
    private final ClaudeAiService claudeAiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public WorkoutPlanDto generatePlan(String userId, GeneratePlanRequest request) {
        String aiJson = claudeAiService.generateWorkoutPlan(
                request.getFitnessGoal(),
                request.getFitnessLevel(),
                request.getDaysPerWeek(),
                request.getEquipment()
        );

        WorkoutPlan plan = parsePlanFromJson(aiJson, userId, request);
        plan.setAiGenerated(true);
        plan = planRepository.save(plan);
        return toDto(plan);
    }

    public List<WorkoutPlanDto> getUserPlans(String userId) {
        return planRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).toList();
    }

    public WorkoutPlanDto getPlan(String planId, String userId) {
        WorkoutPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        if (!plan.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }
        return toDto(plan);
    }

    public void deletePlan(String planId, String userId) {
        WorkoutPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        if (!plan.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }
        planRepository.delete(plan);
    }

    private WorkoutPlan parsePlanFromJson(String json, String userId, GeneratePlanRequest request) {
        try {
            JsonNode root = objectMapper.readTree(json);

            WorkoutPlan plan = WorkoutPlan.builder()
                    .userId(userId)
                    .name(root.path("name").asText("AI Workout Plan"))
                    .description(root.path("description").asText())
                    .fitnessGoal(request.getFitnessGoal())
                    .fitnessLevel(request.getFitnessLevel())
                    .durationWeeks(root.path("durationWeeks").asInt(8))
                    .days(new ArrayList<>())
                    .build();

            JsonNode daysNode = root.path("days");
            for (JsonNode dayNode : daysNode) {
                WorkoutDay day = WorkoutDay.builder()
                        .workoutPlan(plan)
                        .dayNumber(dayNode.path("dayNumber").asInt())
                        .dayName(dayNode.path("dayName").asText())
                        .focus(dayNode.path("focus").asText())
                        .exercises(new ArrayList<>())
                        .build();

                for (JsonNode exNode : dayNode.path("exercises")) {
                    Exercise exercise = Exercise.builder()
                            .workoutDay(day)
                            .name(exNode.path("name").asText())
                            .muscleGroup(exNode.path("muscleGroup").asText())
                            .sets(exNode.path("sets").asInt(3))
                            .reps(exNode.path("reps").asText("10"))
                            .restSeconds(exNode.path("restSeconds").asInt(60))
                            .notes(exNode.path("notes").asText(""))
                            .type(parseExerciseType(exNode.path("type").asText()))
                            .build();
                    day.getExercises().add(exercise);
                }
                plan.getDays().add(day);
            }
            return plan;
        } catch (Exception e) {
            log.error("Failed to parse AI response", e);
            throw new RuntimeException("Failed to parse workout plan");
        }
    }

    private Exercise.ExerciseType parseExerciseType(String type) {
        try {
            return Exercise.ExerciseType.valueOf(type);
        } catch (Exception e) {
            return Exercise.ExerciseType.STRENGTH;
        }
    }

    private WorkoutPlanDto toDto(WorkoutPlan plan) {
        List<WorkoutPlanDto.WorkoutDayDto> dayDtos = plan.getDays() == null ? List.of() :
                plan.getDays().stream().map(day -> {
                    List<WorkoutPlanDto.ExerciseDto> exDtos = day.getExercises() == null ? List.of() :
                            day.getExercises().stream().map(ex -> WorkoutPlanDto.ExerciseDto.builder()
                                    .id(ex.getId())
                                    .name(ex.getName())
                                    .muscleGroup(ex.getMuscleGroup())
                                    .sets(ex.getSets())
                                    .reps(ex.getReps())
                                    .restSeconds(ex.getRestSeconds())
                                    .type(ex.getType() != null ? ex.getType().name() : null)
                                    .notes(ex.getNotes())
                                    .build()).toList();

                    return WorkoutPlanDto.WorkoutDayDto.builder()
                            .id(day.getId())
                            .dayNumber(day.getDayNumber())
                            .dayName(day.getDayName())
                            .focus(day.getFocus())
                            .exercises(exDtos)
                            .build();
                }).toList();

        return WorkoutPlanDto.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .fitnessGoal(plan.getFitnessGoal())
                .fitnessLevel(plan.getFitnessLevel())
                .durationWeeks(plan.getDurationWeeks())
                .aiGenerated(plan.isAiGenerated())
                .days(dayDtos)
                .createdAt(plan.getCreatedAt())
                .build();
    }
}
