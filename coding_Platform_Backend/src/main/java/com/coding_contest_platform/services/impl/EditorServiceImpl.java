package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.EditorResponse;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemData;
import com.coding_contest_platform.repository.ProblemDataRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.services.EditorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EditorServiceImpl implements EditorService {

    private final ProblemRepository problemRepository;
    private final ProblemDataRepository problemDataRepository;

    @Override
    public EditorResponse getProblem(String id) {
        Problem problem = problemRepository.findOneById(id);
        ProblemData problemData = problemDataRepository.findOneById(id);
        return new EditorResponse(
                id,
                problem.getTitle(),
                problem.getDifficulty(),
                problem.getAcceptance(),
                problemData.getDescription(),
                problemData.getApproach(),
                "Code here for this problem"
        );
    }
}
