package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.contest.ContestLeaderBoardDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.ContestResultsRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.services.ContestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContestResultServiceImpl implements ContestResultService {
    private final UserRepository userRepository;
    private final ContestResultsRepository contestResultsRepository;
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
        int cnt = 0;
        for(String pId : points.keySet()){
            int pts = points.get(pId);
            total += pts;
            if(pts > 0){
                cnt++;
            }
        }
        contestResultDTO.setTotalPoints(total);
        contestResultDTO.setProblemsSolved(cnt);
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

    //dont use this
    @Override
    public Map<String, ContestResultDTO> getContestResults(String cId) {
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return null;
        }
        return (Map<String, ContestResultDTO>) contestResults.getResults();
    }

    @Override
    public List<ContestLeaderBoardDTO> getContestLeaderBoard(String cId) {
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return new ArrayList<>();
        }
        List<ContestLeaderBoardDTO> leaderBoardDTOS = new ArrayList<>();

        Map<String , ContestResultDTO> resultDTOMap = contestResults.getResults();
        for(String uId : resultDTOMap.keySet()){
            ContestResultDTO contestResultDTO = resultDTOMap.get(uId);
            User user = userRepository.findOneById(uId);
            ContestLeaderBoardDTO contestLeaderBoardDTO = new ContestLeaderBoardDTO(
                    user.getUname(),
                    user.getEmail(),
                    contestResultDTO.getProblemsSolved(),
                    contestResultDTO.getTotalPoints(),
                    contestResultDTO.getCompletionTime()
            );
            leaderBoardDTOS.add(contestLeaderBoardDTO);
        }
        return leaderBoardDTOS;
    }
}
