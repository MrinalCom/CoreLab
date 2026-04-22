package com.gymapp.trackingservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class WorkoutCompletedEvent {
    private String userId;
    private String sessionId;
    private String workoutName;
}
