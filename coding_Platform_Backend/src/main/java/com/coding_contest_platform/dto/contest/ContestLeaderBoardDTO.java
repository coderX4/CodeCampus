package com.coding_contest_platform.dto.contest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestLeaderBoardDTO {
    private String uname;
    private String email;
    private int solved;
    private int score;
    private String finishTime;
}
