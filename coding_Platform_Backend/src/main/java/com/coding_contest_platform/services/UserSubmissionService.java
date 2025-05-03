package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.MainSectionDTO;
import com.coding_contest_platform.dto.editor.ExecutionResponse;
import com.coding_contest_platform.dto.editor.SubmissionDTO;

import java.util.List;

public interface UserSubmissionService {
    List<SubmissionDTO> getSubmissions(String email, String id);

    boolean saveSubmissions(String email, String pId, List<ExecutionResponse> executionResponseList, String language, String code);

    //MainSectionDTO sendMainSection(String email);
}
