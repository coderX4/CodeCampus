package com.coding_contest_platform.entity;

import com.coding_contest_platform.dto.editor.SubmissionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "users_submissions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSubmissions {
    @Id
    private String email; // mail of the user
    private Map<String, List<SubmissionDTO>> submission; // key=>String(Problem id)
    private int totalScore;
    private List<String> problemsSolved;
    private List<String> problemAttempted;
}

