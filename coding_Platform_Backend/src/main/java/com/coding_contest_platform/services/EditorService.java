package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.EditorResponse;

public interface EditorService {
    EditorResponse getProblem(String id);
}
