package com.gymapp.workoutservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workout_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    private String description;
    private String fitnessGoal;
    private String fitnessLevel;
    private Integer durationWeeks;

    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutDay> days;

    @Builder.Default
    private boolean aiGenerated = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
