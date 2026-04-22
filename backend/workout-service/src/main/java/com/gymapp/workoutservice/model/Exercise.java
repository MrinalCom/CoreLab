package com.gymapp.workoutservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercises")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id")
    private WorkoutDay workoutDay;

    @Column(nullable = false)
    private String name;

    private String muscleGroup;
    private Integer sets;
    private String reps;
    private Integer restSeconds;
    private String notes;

    @Enumerated(EnumType.STRING)
    private ExerciseType type;

    public enum ExerciseType {
        STRENGTH, CARDIO, FLEXIBILITY, HIIT
    }
}
