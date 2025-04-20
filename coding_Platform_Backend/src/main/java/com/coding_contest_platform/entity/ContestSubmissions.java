package com.coding_contest_platform.entity;

import com.coding_contest_platform.dto.contest.ContestUserSubmissionDTO;
import com.coding_contest_platform.dto.editor.SubmissionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "contests_submissions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestSubmissions {
    @Id
    private String contestId;
    private Map<String, Map<String, List<SubmissionDTO>>> contestSubmissions; // userids=>(pids=> {list of submissioms})
}
