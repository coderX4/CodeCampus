package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.problem.ActiveProblemDTO;
import com.coding_contest_platform.dto.problem.ProblemRequest;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemData;
import com.coding_contest_platform.entity.ProblemTestCase;
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

    ProblemTestCase getProblemTestCase(String id);

    List<Problem> getActiveProblems();

    void saveSubmission(String id, boolean isAccepted);

    List<ActiveProblemDTO> getActiveProblems(String email);
}
