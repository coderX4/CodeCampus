package com.coding_contest_platform.dto.editor;

import com.coding_contest_platform.dto.problem.TestCase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditorResponse {
    private String id;
    private String title;
    private String difficulty;
    private String acceptance;
    private String description;
    private String approach;
    private Map<String, String> codeTemplates;
    private Map<String, List<TestCase>> testCases;
    private boolean solved;
    private boolean attempted;
}
