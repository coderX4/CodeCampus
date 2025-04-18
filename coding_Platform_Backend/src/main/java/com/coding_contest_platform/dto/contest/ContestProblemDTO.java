package com.coding_contest_platform.dto.contest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestProblemDTO {
    private String id;
    private String title;
    private String difficulty;
    private List<String> tags;
    private String description;
    private Map<String, String> codeTemplates;
}
