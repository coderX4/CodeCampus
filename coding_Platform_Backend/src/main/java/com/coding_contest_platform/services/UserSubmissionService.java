package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.ExecutionResponse;
import com.coding_contest_platform.dto.SubmissionDTO;
import com.coding_contest_platform.entity.UserSubmissions;

import java.util.List;

public interface UserSubmissionService {
    List<SubmissionDTO> getSubmissions(String email, String id);

    boolean saveSubmissions(String email, String pId, List<ExecutionResponse> executionResponseList, String language, String code);
}
