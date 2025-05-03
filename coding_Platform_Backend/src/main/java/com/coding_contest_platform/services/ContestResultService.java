package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.contest.ContestLeaderBoardDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface ContestResultService {
    @Transactional
    void updateResult(String contestId, String pId, String uId, boolean isSolved);

    @Transactional
    void finishContest(String uId, String cId, String timestamp, boolean voilation, boolean submitted);

    ContestResultDTO sendResult(String uId, String email, String cId);

    List<ContestLeaderBoardDTO> getContestLeaderBoard(String cId);
}
