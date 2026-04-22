package com.gymapp.workoutservice.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaudeAiService {

    @Value("${claude.api.key:}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    @Value("${claude.api.model}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public String generateWorkoutPlan(String fitnessGoal, String fitnessLevel,
                                       Integer daysPerWeek, String equipment) {
        if (apiKey == null || apiKey.isBlank()) {
            return getMockWorkoutPlan(fitnessGoal, fitnessLevel, daysPerWeek);
        }

        String prompt = buildPrompt(fitnessGoal, fitnessLevel, daysPerWeek, equipment);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = Map.of(
                    "model", model,
                    "max_tokens", 2048,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("content").get(0).path("text").asText();

        } catch (Exception e) {
            log.warn("Claude API unavailable, using mock: {}", e.getMessage());
            return getMockWorkoutPlan(fitnessGoal, fitnessLevel, daysPerWeek);
        }
    }

    private String buildPrompt(String goal, String level, Integer days, String equipment) {
        return String.format("""
                Create a detailed %d-day per week workout plan for someone with the following profile:
                - Fitness Goal: %s
                - Fitness Level: %s
                - Equipment: %s

                Return a JSON object with this structure:
                {
                  "name": "Plan Name",
                  "description": "Brief description",
                  "durationWeeks": 8,
                  "days": [
                    {
                      "dayNumber": 1,
                      "dayName": "Monday",
                      "focus": "Chest & Triceps",
                      "exercises": [
                        {
                          "name": "Bench Press",
                          "muscleGroup": "Chest",
                          "sets": 4,
                          "reps": "8-10",
                          "restSeconds": 90,
                          "type": "STRENGTH",
                          "notes": "Keep elbows at 45 degrees"
                        }
                      ]
                    }
                  ]
                }
                Return only valid JSON, no markdown.
                """, days, goal, level, equipment);
    }

    private String getMockWorkoutPlan(String goal, String level, Integer days) {
        return """
                {
                  "name": "AI Workout Plan (Mock)",
                  "description": "A balanced workout plan for %s at %s level",
                  "durationWeeks": 8,
                  "days": [
                    {
                      "dayNumber": 1,
                      "dayName": "Monday",
                      "focus": "Upper Body",
                      "exercises": [
                        {"name": "Push-ups", "muscleGroup": "Chest", "sets": 3, "reps": "10-15", "restSeconds": 60, "type": "STRENGTH", "notes": ""},
                        {"name": "Dumbbell Rows", "muscleGroup": "Back", "sets": 3, "reps": "10-12", "restSeconds": 60, "type": "STRENGTH", "notes": ""},
                        {"name": "Shoulder Press", "muscleGroup": "Shoulders", "sets": 3, "reps": "10-12", "restSeconds": 60, "type": "STRENGTH", "notes": ""}
                      ]
                    },
                    {
                      "dayNumber": 2,
                      "dayName": "Wednesday",
                      "focus": "Lower Body",
                      "exercises": [
                        {"name": "Squats", "muscleGroup": "Quads", "sets": 4, "reps": "12-15", "restSeconds": 90, "type": "STRENGTH", "notes": ""},
                        {"name": "Lunges", "muscleGroup": "Glutes", "sets": 3, "reps": "10 each leg", "restSeconds": 60, "type": "STRENGTH", "notes": ""},
                        {"name": "Calf Raises", "muscleGroup": "Calves", "sets": 3, "reps": "15-20", "restSeconds": 45, "type": "STRENGTH", "notes": ""}
                      ]
                    },
                    {
                      "dayNumber": 3,
                      "dayName": "Friday",
                      "focus": "Full Body",
                      "exercises": [
                        {"name": "Burpees", "muscleGroup": "Full Body", "sets": 3, "reps": "10", "restSeconds": 60, "type": "HIIT", "notes": ""},
                        {"name": "Plank", "muscleGroup": "Core", "sets": 3, "reps": "30-60 sec", "restSeconds": 45, "type": "STRENGTH", "notes": ""},
                        {"name": "Mountain Climbers", "muscleGroup": "Core", "sets": 3, "reps": "20", "restSeconds": 45, "type": "HIIT", "notes": ""}
                      ]
                    }
                  ]
                }
                """.formatted(goal, level);
    }
}
