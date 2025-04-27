package com.coding_contest_platform.entity;

import com.coding_contest_platform.dto.contest.ContestResultDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "contests_results")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestResults {
    @Id
    private String contestId;
    private Map<String, ContestResultDTO> results; // userids=>(results)
}
