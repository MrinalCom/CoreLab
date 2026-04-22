package com.gymapp.trackingservice.service;

import com.gymapp.trackingservice.dto.CreateSessionRequest;
import com.gymapp.trackingservice.dto.ProgressStatsDto;
import com.gymapp.trackingservice.dto.SessionDto;
import com.gymapp.trackingservice.event.WorkoutCompletedEvent;
import com.gymapp.trackingservice.model.ExerciseLog;
import com.gymapp.trackingservice.model.SetLog;
import com.gymapp.trackingservice.model.WorkoutSession;
import com.gymapp.trackingservice.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final WorkoutSessionRepository sessionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public SessionDto createSession(String userId, CreateSessionRequest request) {
        WorkoutSession session = WorkoutSession.builder()
                .userId(userId)
                .workoutPlanId(request.getWorkoutPlanId())
                .workoutDayId(request.getWorkoutDayId())
                .workoutName(request.getWorkoutName())
                .sessionDate(request.getSessionDate())
                .notes(request.getNotes())
                .exerciseLogs(new ArrayList<>())
                .build();
        return toDto(sessionRepository.save(session));
    }

    public List<SessionDto> getUserSessions(String userId) {
        return sessionRepository.findByUserIdOrderBySessionDateDesc(userId)
                .stream().map(this::toDto).toList();
    }

    public SessionDto getSession(String sessionId, String userId) {
        WorkoutSession session = getSessionForUser(sessionId, userId);
        return toDto(session);
    }

    @Transactional
    public SessionDto completeSession(String sessionId, String userId, Integer durationMinutes) {
        WorkoutSession session = getSessionForUser(sessionId, userId);
        session.setStatus(WorkoutSession.SessionStatus.COMPLETED);
        session.setDurationMinutes(durationMinutes);
        session = sessionRepository.save(session);

        kafkaTemplate.send("workout-completed", new WorkoutCompletedEvent(userId, sessionId, session.getWorkoutName()));

        return toDto(session);
    }

    @Transactional
    public SessionDto logExerciseSet(String sessionId, String userId, String exerciseName,
                                      String exerciseId, Integer setNumber, Integer reps,
                                      Double weight, Integer durationSeconds) {
        WorkoutSession session = getSessionForUser(sessionId, userId);

        ExerciseLog exerciseLog = session.getExerciseLogs().stream()
                .filter(e -> e.getExerciseName().equals(exerciseName))
                .findFirst()
                .orElseGet(() -> {
                    ExerciseLog newLog = ExerciseLog.builder()
                            .session(session)
                            .exerciseName(exerciseName)
                            .exerciseId(exerciseId)
                            .sets(new ArrayList<>())
                            .build();
                    session.getExerciseLogs().add(newLog);
                    return newLog;
                });

        SetLog setLog = SetLog.builder()
                .exerciseLog(exerciseLog)
                .setNumber(setNumber)
                .reps(reps)
                .weight(weight)
                .durationSeconds(durationSeconds)
                .completed(true)
                .build();
        exerciseLog.getSets().add(setLog);

        return toDto(sessionRepository.save(session));
    }

    public ProgressStatsDto getStats(String userId) {
        List<WorkoutSession> sessions = sessionRepository.findByUserIdOrderBySessionDateDesc(userId);
        long completed = sessions.stream().filter(s -> s.getStatus() == WorkoutSession.SessionStatus.COMPLETED).count();
        int totalMinutes = sessions.stream().filter(s -> s.getDurationMinutes() != null)
                .mapToInt(WorkoutSession::getDurationMinutes).sum();

        int streak = calculateStreak(sessions);

        return ProgressStatsDto.builder()
                .totalSessions((long) sessions.size())
                .completedSessions(completed)
                .currentStreak(streak)
                .longestStreak(streak)
                .totalMinutes(totalMinutes)
                .build();
    }

    private int calculateStreak(List<WorkoutSession> sessions) {
        LocalDate today = LocalDate.now();
        int streak = 0;
        for (WorkoutSession session : sessions) {
            if (session.getStatus() == WorkoutSession.SessionStatus.COMPLETED &&
                    session.getSessionDate().equals(today.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private WorkoutSession getSessionForUser(String sessionId, String userId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!session.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Access denied");
        }
        return session;
    }

    private SessionDto toDto(WorkoutSession session) {
        List<SessionDto.ExerciseLogDto> logs = session.getExerciseLogs() == null ? List.of() :
                session.getExerciseLogs().stream().map(log -> {
                    List<SessionDto.SetLogDto> sets = log.getSets() == null ? List.of() :
                            log.getSets().stream().map(set -> SessionDto.SetLogDto.builder()
                                    .id(set.getId())
                                    .setNumber(set.getSetNumber())
                                    .reps(set.getReps())
                                    .weight(set.getWeight())
                                    .durationSeconds(set.getDurationSeconds())
                                    .completed(set.getCompleted())
                                    .build()).toList();
                    return SessionDto.ExerciseLogDto.builder()
                            .id(log.getId())
                            .exerciseName(log.getExerciseName())
                            .exerciseId(log.getExerciseId())
                            .sets(sets)
                            .build();
                }).toList();

        return SessionDto.builder()
                .id(session.getId())
                .workoutPlanId(session.getWorkoutPlanId())
                .workoutDayId(session.getWorkoutDayId())
                .workoutName(session.getWorkoutName())
                .sessionDate(session.getSessionDate())
                .durationMinutes(session.getDurationMinutes())
                .notes(session.getNotes())
                .status(session.getStatus().name())
                .exerciseLogs(logs)
                .createdAt(session.getCreatedAt())
                .build();
    }
}
