package com.gymapp.workoutservice.repository;

import com.gymapp.workoutservice.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(String userId);
}
