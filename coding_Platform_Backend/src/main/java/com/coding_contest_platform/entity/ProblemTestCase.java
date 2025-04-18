package com.coding_contest_platform.entity;

import com.coding_contest_platform.dto.problem.TestCase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "problems_testcases")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemTestCase {
    @Id
    private String id;  // Custom ID same as that of Problem
    private Map<String, List<TestCase>> testCases;
}