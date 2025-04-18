package com.coding_contest_platform.dto.editor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionResponse {
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private boolean isCorrect;
    private String error; // Stores any error messages
}
