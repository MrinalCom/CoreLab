package com.gymapp.workoutservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "workout_days")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutDay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id")
    private WorkoutPlan workoutPlan;

    private Integer dayNumber;
    private String dayName;
    private String focus;

    @OneToMany(mappedBy = "workoutDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises;
}
