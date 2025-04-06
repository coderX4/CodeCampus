package com.coding_contest_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemDataResponse {
    private String description;
    private String approach;
    private Map<String, String> codeTemplates;
    private Map<String, List<TestCase>> testCases;
}
