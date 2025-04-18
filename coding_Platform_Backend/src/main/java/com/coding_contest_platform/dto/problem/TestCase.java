package com.coding_contest_platform.dto.problem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCase {
    private String input;
    private String expectedOutput;
}
