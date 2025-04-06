package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.EditorResponse;
import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.TestCase;

public interface EditorService {
    EditorResponse getProblem(String id);

    ExecutionResponse executeSingleTestCase(String code, String language, TestCase testCase);
}
