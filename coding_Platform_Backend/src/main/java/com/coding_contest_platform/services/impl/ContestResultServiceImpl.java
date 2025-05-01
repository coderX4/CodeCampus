package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.contest.ContestLeaderBoardDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.ContestRepository;
import com.coding_contest_platform.repository.ContestResultsRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.services.ContestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContestResultServiceImpl implements ContestResultService {
    private final UserRepository userRepository;
    private final ContestResultsRepository contestResultsRepository;
    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;

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

    public int findMaxScore(String pId){
        String difficulty = problemRepository.findOneById(pId).getDifficulty();
        return switch (difficulty) {
            case "easy" -> 100;
            case "medium" -> 200;
            case "hard" -> 300;
            default -> 0;
        };
    }

    public double getTimeDifference(String start, String completion, int maxTime) {
        DateTimeFormatter startFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter completionFormatter = DateTimeFormatter.ofPattern("h:mm:ss a");

        LocalTime startTime = LocalTime.parse(start, startFormatter);
        LocalTime completionTime = LocalTime.parse(completion, completionFormatter);

        Duration duration = completionTime.isBefore(startTime)
                ? Duration.between(startTime, completionTime.plusHours(24))
                : Duration.between(startTime, completionTime);

        int minutes = (int)duration.toMinutes();
        int seconds = (int)duration.minusMinutes(minutes).getSeconds();

        // Convert times to total seconds
        int timeTakenInSeconds = (minutes * 60) + seconds;
        int maxTimeInSeconds = maxTime * 3600;

        return (1.0 - ((double) timeTakenInSeconds / maxTimeInSeconds));
    }

    public int finalScoreCalculator(int totalScore, int maxScore,
                                    String start, String completion, int maxTime,
                                    int numberOfParticipants){

        /*Leaderboard Score = ( (Total Score / Max Score) × 0.7 +
                                (1 - (Time Taken in Seconds / Max Time in Seconds)) × 0.3) ×
                                 log2(Number of Participants + 1) */

        if (totalScore == 0 || maxScore == 0 || maxTime == 0){
            return 0;
        }

        // Normalized score (0.0 to 1.0)
        double normalizedScore = (double) totalScore / maxScore;

        // Time efficiency (0.0 to 1.0)
        double timeEfficiency = getTimeDifference(start, completion, maxTime);
        timeEfficiency = Math.max(0.0, Math.min(timeEfficiency, 1.0)); // Clamp

        // Participation boost: log2(n + 1)
        double participationBoost = Math.log(numberOfParticipants + 1) / Math.log(2);

        // Weighted score
        double weightedScore = (normalizedScore * 0.7) + (timeEfficiency * 0.3);

        // Final leaderboard score
        double finalScore = weightedScore * participationBoost;

        return (int) Math.round(finalScore * 100); // Scale and return as int
    }

    @Transactional
    @Override
    public void finishContest(String uId, String cId, String timestamp, boolean voilation, boolean submitted) {
        User user = userRepository.findOneById(uId);
        Contest contest = contestRepository.findOneById(cId);
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        Map<String, ContestResultDTO> result  = contestResults.getResults();
        ContestResultDTO contestResultDTO = result.get(uId);
        contestResultDTO.setViolation(voilation);
        contestResultDTO.setSubmitted(submitted);
        contestResultDTO.setCompletionTime(timestamp);
        Map<String, Integer> points = contestResultDTO.getPoints();
        int total = 0, cnt = 0, maxScore = 0;
        for(String pId : points.keySet()){
            int pts = points.get(pId);
            total += pts;
            if(pts > 0){
                cnt++;
            }
            maxScore += findMaxScore(pId);
        }
        contestResultDTO.setTotalPoints(total);
        contestResultDTO.setProblemsSolved(cnt);
        contestResultDTO.setMaxPoints(maxScore);
        contestResultDTO.setFinalScore(
                finalScoreCalculator(total,maxScore, contest.getStartTime(), timestamp,
                        Integer.parseInt(contest.getDuration()),contest.getParticipants())
        );
        result.put(uId, contestResultDTO);
        contestResults.setResults(result);
        contestResultsRepository.save(contestResults);

        user.setContests(user.getContests() + 1);
        userRepository.save(user);
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
                    contestResultDTO.getMaxPoints(),
                    contestResultDTO.getCompletionTime(),
                    contestResultDTO.getFinalScore()
            );
            leaderBoardDTOS.add(contestLeaderBoardDTO);
        }
        return leaderBoardDTOS;
    }
}
