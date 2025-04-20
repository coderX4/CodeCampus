package com.coding_contest_platform.dto.contest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestExecutionRequest {
    private String email;
    private String contestId;
    private String language;
    private String code;
}
