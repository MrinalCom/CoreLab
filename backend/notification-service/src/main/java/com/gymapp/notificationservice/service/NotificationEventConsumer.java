package com.gymapp.notificationservice.service;

import com.gymapp.notificationservice.event.UserRegisteredEvent;
import com.gymapp.notificationservice.event.WorkoutCompletedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationEventConsumer {

    @KafkaListener(topics = "user-registered", groupId = "notification-group")
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("New user registered: {} ({})", event.getName(), event.getEmail());
        // TODO: send welcome email via SendGrid/SES
    }

    @KafkaListener(topics = "workout-completed", groupId = "notification-group")
    public void onWorkoutCompleted(WorkoutCompletedEvent event) {
        log.info("User {} completed workout: {}", event.getUserId(), event.getWorkoutName());
        // TODO: send push notification via FCM
    }
}
