package com.gymapp.userservice.service;

import com.gymapp.userservice.dto.UserProfileDto;
import com.gymapp.userservice.model.User;
import com.gymapp.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toDto(user);
    }

    public UserProfileDto updateProfile(String userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getAge() != null) user.setAge(dto.getAge());
        if (dto.getWeight() != null) user.setWeight(dto.getWeight());
        if (dto.getHeight() != null) user.setHeight(dto.getHeight());
        if (dto.getFitnessGoal() != null) user.setFitnessGoal(User.FitnessGoal.valueOf(dto.getFitnessGoal()));
        if (dto.getFitnessLevel() != null) user.setFitnessLevel(User.FitnessLevel.valueOf(dto.getFitnessLevel()));

        return toDto(userRepository.save(user));
    }

    private UserProfileDto toDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .age(user.getAge())
                .weight(user.getWeight())
                .height(user.getHeight())
                .fitnessGoal(user.getFitnessGoal().name())
                .fitnessLevel(user.getFitnessLevel().name())
                .build();
    }
}
