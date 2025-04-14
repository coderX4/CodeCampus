package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.*;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.entity.UserSubmissions;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.services.EditorService;
import com.coding_contest_platform.services.ProblemService;
import com.coding_contest_platform.services.UserServices;
import com.coding_contest_platform.services.UserSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/editor")
@RequiredArgsConstructor
public class EditorController {

    private final EditorService editorService;
    private final ProblemService problemService;
    private final UserSubmissionService userSubmissionService;
    private final ProblemRepository problemRepository;

    @GetMapping({"/getproblem/{id}"})
    public ResponseEntity<?> getProblem(@PathVariable String id) {
        return ResponseEntity.ok(editorService.getProblem(id));
    }

    @PostMapping({"/execute-run/{id}"})
    public ResponseEntity<List<ExecutionResponse>> executeCodeRun(@PathVariable String id,@RequestBody ExecutionRequest executionRequest) throws ExecutionException, InterruptedException {

        ProblemTestCase problemTestCase = problemService.getProblemTestCase(id);
        Map<String, List<TestCase>> testCasesMap = problemTestCase.getTestCases();
        List<TestCase> runTestCases = testCasesMap.getOrDefault("run", new ArrayList<>());

        return ResponseEntity.ok(editorService.parallelExecutor(
                executionRequest.getCode(),
                executionRequest.getLanguage(),
                runTestCases)
        );
    }

    @PostMapping({"/execute-submit/{id}"})
    public ResponseEntity<List<ExecutionResponse>> executeCodeSubmit(@PathVariable String id,@RequestBody ExecutionRequest executionRequest) throws ExecutionException, InterruptedException {
        ProblemTestCase problemTestCase = problemService.getProblemTestCase(id);
        Map<String, List<TestCase>> testCasesMap = problemTestCase.getTestCases();
        List<TestCase> submitTestCases = testCasesMap.getOrDefault("submit", new ArrayList<>());
        submitTestCases.addAll(testCasesMap.getOrDefault("run", new ArrayList<>()));

        List<ExecutionResponse> executionResponses = editorService.parallelExecutor(
                executionRequest.getCode(),
                executionRequest.getLanguage(),
                submitTestCases
        );

        boolean isAccepted = userSubmissionService.saveSubmissions(
                executionRequest.getEmail(),
                id,
                executionResponses,
                executionRequest.getLanguage(),
                executionRequest.getCode()
        );

        Problem problem = problemRepository.findOneById(id);
        problem.setSubmissions(problem.getSubmissions() + 1);
        if(isAccepted){
            problem.setAcceptedSubmissions(problem.getAcceptedSubmissions() + 1);
        }
        float rate = Math.round(((float) problem.getAcceptedSubmissions() / problem.getSubmissions()) * 10000) / 100f;
        problem.setAcceptance(String.format("%.2f", rate) + " %");
        problemRepository.save(problem);

        return ResponseEntity.ok(executionResponses);
    }

    @GetMapping({"/getsubmissions/{email}/{id}"})
    public ResponseEntity<?> getSubmissions(@PathVariable("id") String id,@PathVariable("email") String email){
        List<SubmissionDTO> submissionDTOList = userSubmissionService.getSubmissions(email,id);
        return ResponseEntity.ok(submissionDTOList);
    }
}
