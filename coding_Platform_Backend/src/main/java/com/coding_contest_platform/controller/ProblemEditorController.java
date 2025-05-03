package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.editor.ExecutionRequest;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import com.coding_contest_platform.dto.problem.TestCase;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.services.EditorService;
import com.coding_contest_platform.services.LeaderBoardService;
import com.coding_contest_platform.services.ProblemService;
import com.coding_contest_platform.services.UserSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/editor")
@RequiredArgsConstructor
public class ProblemEditorController {

    private final EditorService editorService;
    private final ProblemService problemService;
    private final UserSubmissionService userSubmissionService;
    private final LeaderBoardService leaderBoardService;

    @GetMapping({"/getproblem/{email}/{id}"})
    public ResponseEntity<?> getProblem(@PathVariable("id") String id, @PathVariable("email") String email) {
        return ResponseEntity.ok(editorService.getProblem(id,email));
    }

    @PostMapping({"/execute-run/{id}"})
    public ResponseEntity<List<ExecutionResponse>> executeCodeRun(@PathVariable String id, @RequestBody ExecutionRequest executionRequest) throws ExecutionException, InterruptedException {

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
        String email = executionRequest.getEmail();
        boolean isAccepted = userSubmissionService.saveSubmissions(
                email,
                id,
                executionResponses,
                executionRequest.getLanguage(),
                executionRequest.getCode()
        );

        problemService.saveSubmission(id, isAccepted);

        if(isAccepted){
            leaderBoardService.updateLeaderBoardScore(email);
        }

        return ResponseEntity.ok(executionResponses);
    }

    @GetMapping({"/getsubmissions/{email}/{id}"})
    public ResponseEntity<?> getSubmissions(@PathVariable("id") String id,@PathVariable("email") String email){
        List<SubmissionDTO> submissionDTOList = userSubmissionService.getSubmissions(email,id);
        return ResponseEntity.ok(submissionDTOList);
    }
}
