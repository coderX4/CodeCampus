package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.repository.ContestRepository;
import com.coding_contest_platform.repository.ContestResultsRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.services.ContestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContestResultServiceImpl implements ContestResultService {
    private final ContestResultsRepository contestResultsRepository;
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;

    public int assignPoints(boolean isSolved, String difficulty){
        if(isSolved){
            return switch (difficulty) {
                case "easy" -> 100;
                case "medium" -> 200;
                case "hard" -> 300;
                default -> 0;
            };
        }
        else{
            return -10;
        }
    }

    @Transactional
    @Override
    public void updateResult(String contestId, String pId, String uId, boolean isSolved) {
        Problem problem = problemRepository.findOneById(pId);
        String difficulty = problem.getDifficulty();
        ContestResults contestResults = contestResultsRepository.findOneByContestId(contestId);

        Map<String, ContestResultDTO> result  = contestResults.getResults();
        ContestResultDTO contestResultDTO = result.getOrDefault(uId, new ContestResultDTO());
        Map<String, Integer> points = contestResultDTO.getPoints();
        int pts = assignPoints(isSolved, difficulty) + points.get(pId);
        points.put(pId, pts);
        contestResultDTO.setPoints(points);
        result.put(uId, contestResultDTO);
        contestResults.setResults(result);
        contestResultsRepository.save(contestResults);
    }

    @Transactional
    @Override
    public void finishContest(String uId, String cId, String timestamp, boolean voilation, boolean submitted) {
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        Map<String, ContestResultDTO> result  = contestResults.getResults();
        ContestResultDTO contestResultDTO = result.get(uId);
        contestResultDTO.setViolation(voilation);
        contestResultDTO.setSubmitted(submitted);
        contestResultDTO.setCompletionTime(timestamp);
        Map<String, Integer> points = contestResultDTO.getPoints();
        int total = 0;
        for(String pId : points.keySet()){
            total += points.get(pId);
        }
        contestResultDTO.setTotalPoints(total);
        result.put(uId, contestResultDTO);
        contestResults.setResults(result);
        contestResultsRepository.save(contestResults);
    }

    @Override
    public ContestResultDTO sendResult(String uId, String cId){
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return null;
        }
        return (ContestResultDTO) contestResults.getResults().get(uId);
    }

    @Override
    public Map<String, ContestResultDTO> getContestResults(String cId) {
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return null;
        }
        return (Map<String, ContestResultDTO>) contestResults.getResults();
    }
}
