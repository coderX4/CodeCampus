package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;

import java.util.List;
import java.util.Map;

public interface ContestSubmissionService {
    boolean saveContestSubmission(String contestId, String uId, String pId, List<ExecutionResponse> executionResponseList, String language, String code);

    Map<String, List<SubmissionDTO>> getSubmissions(String id, String uId);
}
