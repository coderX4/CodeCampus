package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.ProblemRequest;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemData;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProblemService {
    // Generate a custom ID based on difficulty and tags
    String generateCustomId(String difficulty, List<String> tags);

    // Create a new problem
    @Transactional
    ProblemRequest createProblem(ProblemRequest problemRequest);

    List<Problem> getProblems();

    @Transactional
    void deleteProblem(String id);

    @Transactional
    ProblemRequest updateProblem(String id, ProblemRequest problemRequest);

    ProblemData getProblemData(String id);

    List<Problem> getActiveProblems();

}
