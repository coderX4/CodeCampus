package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.contest.ContestDTO;
import com.coding_contest_platform.dto.contest.ContestLeaderBoardDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.services.ContestResultService;
import com.coding_contest_platform.services.ContestService;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contest")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;
    private final UserServices userServices;
    private final ContestResultService contestResultService;

    @PostMapping({"/createcontest"})
    public ResponseEntity<Contest> createContest(@RequestBody Contest contest) {
        return ResponseEntity.ok(contestService.createContest(contest));
    }

    @GetMapping({"/getcontests"})
    public ResponseEntity<List<Contest>> getContests() {
        return ResponseEntity.ok(contestService.getAllContests());
    }

    @DeleteMapping({"/delete/{id}"})
    public ResponseEntity<?> deleteContest(@PathVariable("id") String id) {
        contestService.deleteContest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping({"/update/{id}"})
    public ResponseEntity<Contest> updateContest(@PathVariable("id") String id, @RequestBody Contest contest) {
        return ResponseEntity.ok(contestService.updateContest(contest,id));
    }

    @GetMapping({"/getcontestdetails/{id}"})
    public ResponseEntity<ContestDTO> getContestDetails(@PathVariable("id") String id) {
        return ResponseEntity.ok(contestService.getContestDetails(id));
    }

    @GetMapping({"/register/{id}/{email}"})
    public ResponseEntity<?> registerContest(@PathVariable("id") String id, @PathVariable("email") String email) {
        contestService.addParticipant(id, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping({"/getResult/{email}/{id}"})
    public ResponseEntity<ContestResultDTO> getContestResult(@PathVariable("email") String email ,@PathVariable("id") String id) {
        ContestResultDTO contestResultDTO = contestResultService.sendResult(userServices.getIdByEmail(email),id);
        if(contestResultDTO==null){
            contestResultDTO = new ContestResultDTO();
            return ResponseEntity.ok(contestResultDTO);
        }
        else{
            return ResponseEntity.ok(contestResultDTO);
        }
    }

    @GetMapping({"/getLeaderBoardsResult/{id}"})
    public ResponseEntity<List<ContestLeaderBoardDTO>> contestLeaderboard(@PathVariable("id") String id){
        return ResponseEntity.ok(contestResultService.getContestLeaderBoard(id));
    }
}
