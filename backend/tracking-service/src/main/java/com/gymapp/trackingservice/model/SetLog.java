package com.gymapp.trackingservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "set_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SetLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_log_id")
    private ExerciseLog exerciseLog;

    private Integer setNumber;
    private Integer reps;
    private Double weight;
    private Integer durationSeconds;
    private Boolean completed;
}
