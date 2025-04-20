package com.coding_contest_platform.dto.contest;

import com.coding_contest_platform.dto.editor.SubmissionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestUserSubmissionDTO {
    private String email; // mail of the user
    private Map<String, List<SubmissionDTO>> submission; // key=>String(Problem id)
}
