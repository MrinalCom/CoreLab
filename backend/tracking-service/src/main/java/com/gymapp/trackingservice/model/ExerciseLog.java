package com.gymapp.trackingservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "exercise_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExerciseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private WorkoutSession session;

    @Column(nullable = false)
    private String exerciseName;

    private String exerciseId;

    @OneToMany(mappedBy = "exerciseLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SetLog> sets;
}
