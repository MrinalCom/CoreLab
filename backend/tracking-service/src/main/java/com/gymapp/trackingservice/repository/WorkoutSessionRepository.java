package com.gymapp.trackingservice.repository;

import com.gymapp.trackingservice.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, String> {
    List<WorkoutSession> findByUserIdOrderBySessionDateDesc(String userId);
    List<WorkoutSession> findByUserIdAndSessionDateBetween(String userId, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(s) FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'COMPLETED'")
    Long countCompletedByUserId(String userId);
}
