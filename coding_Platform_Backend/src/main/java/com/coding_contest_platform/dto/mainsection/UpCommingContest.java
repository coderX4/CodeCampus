package com.coding_contest_platform.dto.mainsection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpCommingContest {
    private String id;
    private String title;
    private String description;
    private String startDate;
    private String startTime;
    private String duration;
    private String difficulty;
    private int participants;
}
