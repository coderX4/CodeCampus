package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.ProblemDataResponse;
import com.coding_contest_platform.dto.ProblemRequest;
import com.coding_contest_platform.entity.ProblemData;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    // API to create a problem
    @PostMapping({"/addproblem"})
    public ProblemRequest createProblem(@RequestBody ProblemRequest problemRequest) {
        return problemService.createProblem(problemRequest);
    }

    @GetMapping({"/getproblems"})
    public ResponseEntity<?> getProblems() {
        return ResponseEntity.ok(problemService.getProblems());
    }

    @DeleteMapping({"/delete/{id}"})
    public ResponseEntity<?> deleteProblem(@PathVariable String id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping({"/update/{id}"})
    public ResponseEntity<?> updateProblem(@PathVariable String id, @RequestBody ProblemRequest problemRequest) {
        problemService.updateProblem(id, problemRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping({"/getproblemsdata/{id}"})
    public ResponseEntity<?> getProblemsData(@PathVariable String id) {
        return ResponseEntity.ok(problemService.getProblemData(id));
    }

    @GetMapping("/gettestcases/{id}")
    public ResponseEntity<?> getTestcases(@PathVariable String id) {
        return ResponseEntity.ok(problemService.getProblemTestCase(id));
    }

    //for the edit, copy and view in the frontend
    @GetMapping("/getproblemformdata/{id}")
    public ResponseEntity<ProblemDataResponse> getProblemFormData(@PathVariable String id) {
        ProblemData problemData = problemService.getProblemData(id);
        ProblemTestCase problemTestCase = problemService.getProblemTestCase(id);
        ProblemDataResponse problemDataResponse = new ProblemDataResponse(
                problemData.getDescription(),
                problemData.getApproach(),
                problemData.getCodeTemplates(),
                problemTestCase.getTestCases()
        );
        return ResponseEntity.ok(problemDataResponse);
    }

    //users window
    @GetMapping({"/getactiveproblems"})
    public ResponseEntity<?> getActiveProblems() {
        return ResponseEntity.ok(problemService.getActiveProblems());
    }
}
