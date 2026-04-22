package com.gymapp.trackingservice.controller;

import com.gymapp.trackingservice.dto.CreateSessionRequest;
import com.gymapp.trackingservice.dto.ProgressStatsDto;
import com.gymapp.trackingservice.dto.SessionDto;
import com.gymapp.trackingservice.service.TrackingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/sessions")
    public ResponseEntity<SessionDto> createSession(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trackingService.createSession(userId, request));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionDto>> getSessions(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(trackingService.getUserSessions(userId));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionDto> getSession(
            @PathVariable String sessionId,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(trackingService.getSession(sessionId, userId));
    }

    @PatchMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<SessionDto> completeSession(
            @PathVariable String sessionId,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(trackingService.completeSession(sessionId, userId, body.get("durationMinutes")));
    }

    @PostMapping("/sessions/{sessionId}/log")
    public ResponseEntity<SessionDto> logSet(
            @PathVariable String sessionId,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(trackingService.logExerciseSet(
                sessionId, userId,
                (String) body.get("exerciseName"),
                (String) body.get("exerciseId"),
                (Integer) body.get("setNumber"),
                (Integer) body.get("reps"),
                body.get("weight") != null ? ((Number) body.get("weight")).doubleValue() : null,
                (Integer) body.get("durationSeconds")
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<ProgressStatsDto> getStats(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(trackingService.getStats(userId));
    }
}
