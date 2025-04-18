package com.coding_contest_platform.dto.editor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionDTO {
    private String dateTime;
    private boolean isAccepted;
    private String language;
    private String code;
    List<ExecutionResponse> executionResponse;
}