package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.leaderboard.GlobalLeaderBoardDTO;
import com.coding_contest_platform.services.ContestResultService;
import com.coding_contest_platform.services.ContestService;
import com.coding_contest_platform.services.LeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderBoardController {

    private final ContestService contestService;
    private final LeaderBoardService leaderBoardService;

    @GetMapping({"/getglobal"})
    public ResponseEntity<List<GlobalLeaderBoardDTO>> sendLeaderBoard() {
        return ResponseEntity.ok(leaderBoardService.getGlobalLeaderBoardDTO());
    }

    @GetMapping("/getlistofContests")
    public ResponseEntity<?> getlistOfContests() {
        return ResponseEntity.ok(contestService.listOfContests());
    }
}
