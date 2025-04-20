package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.contest.ContestDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.services.ContestService;
import com.coding_contest_platform.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contest")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;

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
        return ResponseEntity.ok().build();
    }
}
