package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.editor.EditorResponse;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.problem.TestCase;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface EditorService {
    EditorResponse getProblem(String id, String email);

    List<ExecutionResponse> parallelExecutor(String code, String language, List<TestCase> testCases) throws InterruptedException , ExecutionException;
}
