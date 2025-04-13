package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.EditorResponse;
import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.TestCase;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface EditorService {
    EditorResponse getProblem(String id);

    List<ExecutionResponse> parallelExecutor(String code, String language, List<TestCase> testCases) throws InterruptedException , ExecutionException;
}
