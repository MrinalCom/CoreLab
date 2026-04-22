package com.gymapp.trackingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProgressStatsDto {
    private Long totalSessions;
    private Long completedSessions;
    private Integer currentStreak;
    private Integer longestStreak;
    private Double totalVolumeKg;
    private Integer totalMinutes;
}
