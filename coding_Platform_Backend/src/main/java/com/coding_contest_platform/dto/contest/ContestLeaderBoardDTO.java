package com.coding_contest_platform.dto.contest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestLeaderBoardDTO {
    //Show in table
    private String uname;
    private String email;
    private int solved;
    private int score;
    private int maxScore;
    private String finishTime;
    private String timeTaken;
    private int finalScore;

    //extras
    private boolean violation;
    private boolean submitted;
    private Map<String, Integer> points;
    private int[] timeDifference;
}
