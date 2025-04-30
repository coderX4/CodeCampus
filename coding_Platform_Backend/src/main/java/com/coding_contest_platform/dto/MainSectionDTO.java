package com.coding_contest_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MainSectionDTO {
    private int totalScore;
    private List<String> problemsSolved;
    private List<String> problemsAttempted;
}
