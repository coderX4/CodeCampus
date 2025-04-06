package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.ExecutionRequest;
import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.TestCase;
import com.coding_contest_platform.entity.ProblemTestCase;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.services.EditorService;
import com.coding_contest_platform.services.ProblemService;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/api/editor")
@RequiredArgsConstructor
public class EditorController {

    private final EditorService editorService;
    private final ProblemService problemService;
    private final UserServices userServices;

    // Define test cases
    private final List<TestCase> testCases ;

    @GetMapping({"/getproblem/{id}"})
    public ResponseEntity<?> getProblem(@PathVariable String id) {
        return ResponseEntity.ok(editorService.getProblem(id));
    }

    @PostMapping({"/execute/{id}"})
    public ResponseEntity<List<ExecutionResponse>> executeCode(@PathVariable String id,@RequestBody ExecutionRequest executionRequest) throws InterruptedException, ExecutionException {
        User user = userServices.getUserByEmail(executionRequest.getEmail());
        ProblemTestCase problemTestCase = problemService.getProblemTestCase(id);
        Map<String, List<TestCase>> testCasesMap = problemTestCase.getTestCases();
        List<TestCase> runTestCases = testCasesMap.getOrDefault("run", new ArrayList<>());
        if (executionRequest.getIsSubmit().equals("true")) {
            List<TestCase> submitTestCases = testCasesMap.getOrDefault("submit", new ArrayList<>());

            testCases.addAll(runTestCases);
            testCases.addAll(submitTestCases); // Now finalTestCases has both run and submit
        } else {
            testCases.addAll(runTestCases);
        }

        ExecutorService executor = Executors.newFixedThreadPool(1);
        List<Future<ExecutionResponse>> futures = new ArrayList<>();

        for (TestCase testCase : testCases) {
            futures.add(executor.submit(() -> editorService.executeSingleTestCase(executionRequest.getCode(), executionRequest.getLanguage(), testCase)));
        }

        List<ExecutionResponse> results = new ArrayList<>();
        for (Future<ExecutionResponse> future : futures) {
            results.add(future.get());  // Get the result when execution is done
        }

        executor.shutdown();
        testCases.clear();
        return ResponseEntity.ok(results);
    }

}
