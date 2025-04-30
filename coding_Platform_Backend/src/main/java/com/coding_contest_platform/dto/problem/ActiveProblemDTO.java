package com.coding_contest_platform.dto.problem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActiveProblemDTO {
    private String id;  // Custom ID
    private String title;
    private String difficulty;
    private String status;
    private List<String> tags;
    private String acceptance;
    private boolean solved;
    private boolean attempted;
}
