package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.contest.ContestExecutionRequest;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import com.coding_contest_platform.dto.problem.TestCase;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.services.ContestSubmissionService;
import com.coding_contest_platform.services.EditorService;
import com.coding_contest_platform.services.ProblemService;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/contesteditor")
@RequiredArgsConstructor
public class ContestEditorController {

    private final UserServices userServices;
    private final EditorService editorService;
    private final ProblemService problemService;
    private final ContestSubmissionService contestSubmissionService;

    @PostMapping({"/execute-run/{id}"})
    public ResponseEntity<List<ExecutionResponse>> executeCodeRun(@PathVariable String id, @RequestBody ContestExecutionRequest executionRequest) throws ExecutionException, InterruptedException {

        ProblemTestCase problemTestCase = problemService.getProblemTestCase(id);
        Map<String, List<TestCase>> testCasesMap = problemTestCase.getTestCases();
        List<TestCase> runTestCases = testCasesMap.getOrDefault("run", new ArrayList<>());

        return ResponseEntity.ok(editorService.parallelExecutor(
                executionRequest.getCode(),
                executionRequest.getLanguage(),
                runTestCases)
        );
    }

    @PostMapping({"/execute-submit/{pId}"})
    public ResponseEntity<List<ExecutionResponse>> executeCodeSubmit(@PathVariable String pId,@RequestBody ContestExecutionRequest executionRequest) throws ExecutionException, InterruptedException {
        ProblemTestCase problemTestCase = problemService.getProblemTestCase(pId);
        Map<String, List<TestCase>> testCasesMap = problemTestCase.getTestCases();
        List<TestCase> submitTestCases = testCasesMap.getOrDefault("run", new ArrayList<>());
        submitTestCases.addAll(testCasesMap.getOrDefault("submit", new ArrayList<>()));

        List<ExecutionResponse> executionResponses = editorService.parallelExecutor(
                executionRequest.getCode(),
                executionRequest.getLanguage(),
                submitTestCases
        );

        boolean isSolved = contestSubmissionService.saveContestSubmission(
                executionRequest.getContestId(),
                userServices.getIdByEmail(executionRequest.getEmail()),
                pId,
                executionResponses,
                executionRequest.getLanguage(),
                executionRequest.getCode()
        );

        return ResponseEntity.ok(executionResponses);
    }

    @GetMapping({"/getsubmissions/{email}/{id}"})
    public ResponseEntity<Map<String, List<SubmissionDTO>>> getSubmissions(@PathVariable("id") String id,@PathVariable("email") String email){
        Map<String, List<SubmissionDTO>> submissionDTOMap = contestSubmissionService.getSubmissions(id,userServices.getIdByEmail(email));
        return ResponseEntity.ok(submissionDTOMap);
    }
}
