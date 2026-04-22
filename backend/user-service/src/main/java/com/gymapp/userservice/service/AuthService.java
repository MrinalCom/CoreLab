package com.gymapp.userservice.service;

import com.gymapp.userservice.config.JwtUtil;
import com.gymapp.userservice.dto.AuthResponse;
import com.gymapp.userservice.dto.LoginRequest;
import com.gymapp.userservice.dto.RegisterRequest;
import com.gymapp.userservice.event.UserRegisteredEvent;
import com.gymapp.userservice.model.User;
import com.gymapp.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .age(request.getAge())
                .weight(request.getWeight())
                .height(request.getHeight())
                .fitnessGoal(request.getFitnessGoal() != null
                        ? User.FitnessGoal.valueOf(request.getFitnessGoal())
                        : User.FitnessGoal.GENERAL_FITNESS)
                .fitnessLevel(request.getFitnessLevel() != null
                        ? User.FitnessLevel.valueOf(request.getFitnessLevel())
                        : User.FitnessLevel.BEGINNER)
                .build();

        user = userRepository.save(user);

        kafkaTemplate.send("user-registered", new UserRegisteredEvent(user.getId(), user.getEmail(), user.getName()));

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
