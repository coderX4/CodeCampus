package com.coding_contest_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionRequest {
    private String email;
    private String language;
    private String code;
    private String isSubmit;
}
