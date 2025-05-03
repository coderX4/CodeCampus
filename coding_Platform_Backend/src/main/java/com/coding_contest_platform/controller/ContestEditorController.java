package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.contest.ContestExecutionRequest;
import com.coding_contest_platform.dto.contest.Finish_VoilationDTO;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import com.coding_contest_platform.dto.problem.TestCase;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.services.*;
import com.coding_contest_platform.services.LeaderBoardService;
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
    private final ContestResultService contestResultService;
    private final LeaderBoardService leaderBoardService;

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

        String cId = executionRequest.getContestId();
        String uId = userServices.getIdByEmail(executionRequest.getEmail());
        boolean isSolved = contestSubmissionService.saveContestSubmission(
                cId, uId, pId,
                executionResponses,
                executionRequest.getLanguage(),
                executionRequest.getCode()
        );

        contestResultService.updateResult(
                cId, pId, uId, isSolved
        );

        return ResponseEntity.ok(executionResponses);
    }

    @GetMapping({"/getsubmissions/{email}/{id}"})
    public ResponseEntity<Map<String, List<SubmissionDTO>>> getSubmissions(@PathVariable("id") String id,@PathVariable("email") String email){
        Map<String, List<SubmissionDTO>> submissionDTOMap = contestSubmissionService.getSubmissions(id,userServices.getIdByEmail(email));
        return ResponseEntity.ok(submissionDTOMap);
    }

    @PostMapping({"/report-violation"})
    public ResponseEntity<?> reportViolation(@RequestBody Finish_VoilationDTO finishVoilationDTO){
        System.out.println(finishVoilationDTO);
        contestResultService.finishContest(
                userServices.getIdByEmail(finishVoilationDTO.getEmail()),
                finishVoilationDTO.getContestId(),
                finishVoilationDTO.getTimestamp(),
                true,
                false
        );
        return ResponseEntity.ok().build();
    }

    @PostMapping({"/finish-test"})
    public ResponseEntity<?> finishContest(@RequestBody Finish_VoilationDTO finishVoilationDTO){
        String email = finishVoilationDTO.getEmail();
        contestResultService.finishContest(
                userServices.getIdByEmail(email),
                finishVoilationDTO.getContestId(),
                finishVoilationDTO.getTimestamp(),
                false,
                true
        );
        leaderBoardService.updateLeaderBoardScore(email);
        return ResponseEntity.ok().build();
    }
}
