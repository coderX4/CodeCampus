package com.coding_contest_platform.dto.contest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestResultDTO {
    private boolean violation;
    private boolean submitted;
    private String completionTime;
    private Map<String, Integer> points;
    private int totalPoints;
    private int maxPoints;
    private int problemsSolved;
    private int finalScore;
}
