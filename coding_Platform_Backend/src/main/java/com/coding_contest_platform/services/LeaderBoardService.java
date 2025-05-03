package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.leaderboard.GlobalLeaderBoardDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LeaderBoardService {
    @Transactional
    void updateLeaderBoardScore(String email);

    List<GlobalLeaderBoardDTO> getGlobalLeaderBoardDTO();
}
