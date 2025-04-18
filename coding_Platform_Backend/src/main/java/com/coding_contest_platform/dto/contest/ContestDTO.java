package com.coding_contest_platform.dto.contest;

import com.coding_contest_platform.entity.Contest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestDTO {
    private String id;
    private String title;
    private String description;
    private String startDate;
    private String startTime;
    private String duration;
    private String difficulty;
    private int participants;
    private List<ContestProblemDTO> problems;
}
