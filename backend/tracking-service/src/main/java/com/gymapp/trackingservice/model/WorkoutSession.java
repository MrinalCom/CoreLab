package com.gymapp.trackingservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workout_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    private String workoutPlanId;
    private String workoutDayId;
    private String workoutName;

    @Column(nullable = false)
    private LocalDate sessionDate;

    private Integer durationMinutes;
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SessionStatus status = SessionStatus.IN_PROGRESS;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseLog> exerciseLogs;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum SessionStatus {
        IN_PROGRESS, COMPLETED, SKIPPED
    }
}
