package com.coding_contest_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String initialCode;
}
