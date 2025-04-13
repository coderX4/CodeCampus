package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.SubmissionDTO;

import java.util.List;

public interface UserSubmissionService {
    List<SubmissionDTO> getSubmissions(String email, String id);

    void saveSubmissions(String email, String pId, List<ExecutionResponse> executionResponseList, String language, String code);
}
