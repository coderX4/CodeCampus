package com.coding_contest_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemRequest {
    private String title;
    private String difficulty;
    private List<String> tags;
    private String description;
    private String approach;
    private String status;
    private Map<String, String> codeTemplates;             // language → code
    private Map<String, List<TestCase>> testCases;
}
