package com.gymapp.userservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private Integer age;
    private Double weight;
    private Double height;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FitnessGoal fitnessGoal = FitnessGoal.GENERAL_FITNESS;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FitnessLevel fitnessLevel = FitnessLevel.BEGINNER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum FitnessGoal {
        WEIGHT_LOSS, MUSCLE_GAIN, STRENGTH, ENDURANCE, GENERAL_FITNESS
    }

    public enum FitnessLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
