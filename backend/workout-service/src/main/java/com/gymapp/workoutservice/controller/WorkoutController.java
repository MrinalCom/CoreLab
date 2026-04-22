package com.gymapp.workoutservice.controller;

import com.gymapp.workoutservice.dto.GeneratePlanRequest;
import com.gymapp.workoutservice.dto.WorkoutPlanDto;
import com.gymapp.workoutservice.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping("/generate")
    public ResponseEntity<WorkoutPlanDto> generatePlan(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody GeneratePlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.generatePlan(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<WorkoutPlanDto>> getUserPlans(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(workoutService.getUserPlans(userId));
    }

    @GetMapping("/{planId}")
    public ResponseEntity<WorkoutPlanDto> getPlan(
            @PathVariable String planId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(workoutService.getPlan(planId, userId));
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable String planId,
            @RequestHeader("X-User-Id") String userId) {
        workoutService.deletePlan(planId, userId);
        return ResponseEntity.noContent().build();
    }
}
