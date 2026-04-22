package com.gymapp.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProfileDto {
    private String id;
    private String name;
    private String email;
    private Integer age;
    private Double weight;
    private Double height;
    private String fitnessGoal;
    private String fitnessLevel;
}
