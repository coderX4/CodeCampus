package com.coding_contest_platform.dto.leaderboard;

import com.coding_contest_platform.helper.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalLeaderBoardDTO {
    //Show in table
    private String uname;
    private String email;
    private Department department;
    private int problems; // no. of problems participated in
    private int contests; // no. of contest participated in
    private int problemFinalScore; // from user submission
    private int contestFinalScore;
    private int finalLeaderBoardScore; // leader score (global)
}
