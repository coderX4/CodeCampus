package com.coding_contest_platform.dto.mainsection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentSubmissionDTO {
    private String problemId;
    private String problem; //title
    private boolean status;
    private String language;
    private String time;
}
