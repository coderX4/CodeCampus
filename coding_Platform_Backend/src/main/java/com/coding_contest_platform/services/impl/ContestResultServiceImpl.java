package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.contest.ContestLeaderBoardDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.*;
import com.coding_contest_platform.services.ContestResultService;
import com.coding_contest_platform.services.ContestSubmissionService;
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
    private final ContestSubmissionService contestSubmissionService;
    private final ContestSubmissionsRepository contestSubmissionsRepository;

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

    public String convertToHHMMSS(int minutes, int seconds) {
        int totalSeconds = minutes * 60 + seconds;
        int hours = totalSeconds / 3600;
        int remainingSeconds = totalSeconds % 3600;
        int mins = remainingSeconds / 60;
        int secs = remainingSeconds % 60;

        return String.format("%02d:%02d:%02d", hours, mins, secs);
    }

    public int[] getTimeDifference(String start, String completion) {
        DateTimeFormatter startFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter completionFormatter = DateTimeFormatter.ofPattern("h:mm:ss a");

        LocalTime startTime = LocalTime.parse(start, startFormatter);
        LocalTime completionTime = LocalTime.parse(completion, completionFormatter);

        Duration duration = completionTime.isBefore(startTime)
                ? Duration.between(startTime, completionTime.plusHours(24))
                : Duration.between(startTime, completionTime);

        int minutes = (int)duration.toMinutes();
        int seconds = (int)duration.minusMinutes(minutes).getSeconds();

        return new int[]{minutes,seconds};
    }

    public int finalScoreCalculator(int totalScore, int maxScore, int numberOfParticipants,
                                    int minutes, int seconds, int maxTime){

        /*Leaderboard Score = ( (Total Score / Max Score) × 0.7 +
                                (1 - (Time Taken in Seconds / Max Time in Seconds)) × 0.3) ×
                                 log2(Number of Participants + 1) */

        if (totalScore == 0 || maxScore == 0 || maxTime == 0){
            return 0;
        }

        // Normalized score (0.0 to 1.0)
        double normalizedScore = (double) totalScore / maxScore;

        // Convert times to total seconds
        int timeTakenInSeconds = (minutes * 60) + seconds;
        int maxTimeInSeconds = maxTime * 3600;

        // Time efficiency (0.0 to 1.0)
        double timeEfficiency = 1.0 - ((double) timeTakenInSeconds / maxTimeInSeconds);
        timeEfficiency = Math.max(0.0, Math.min(timeEfficiency, 1.0)); // Clamp

        // Participation boost: log2(n + 1)
        double participationBoost = Math.log(numberOfParticipants + 1) / Math.log(2);

        // Weighted score
        double weightedScore = (normalizedScore * 0.7) + (timeEfficiency * 0.3);

        // Final leaderboard score
        double finalScore = weightedScore * participationBoost;

        return (int) Math.round(finalScore * 100); // Scale and return as int
    }

    public long[] finalContestScoreCalculator(int finalScore, String difficulty, long[] totalContestScore){
        long weightN = 0L;
        switch (difficulty){
            case "easy" -> weightN = 1;
            case "medium" -> weightN = 2;
            case "hard" -> weightN = 3;
        }
        totalContestScore[0] = totalContestScore[0] + (finalScore * weightN); //Score1*weight1 + Score2*weight2
        totalContestScore[1] = totalContestScore[1] + weightN; //weight1 + weight2
        return totalContestScore;
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
        int[] timeTaken = getTimeDifference(contest.getStartTime(), timestamp);
        int finalScore = finalScoreCalculator(total,maxScore,contest.getParticipants(),
                timeTaken[0],timeTaken[1],Integer.parseInt(contest.getDuration()));
        contestResultDTO.setTimeDifference(timeTaken);
        contestResultDTO.setTimeTaken(
                convertToHHMMSS(timeTaken[0], timeTaken[1])
        );
        contestResultDTO.setFinalScore(finalScore);
        result.put(uId, contestResultDTO);
        contestResults.setResults(result);
        contestResultsRepository.save(contestResults);

        user.setContests(user.getContests() + 1);

        //All contest scores updation here
        long[] scoresum = user.getTotalContestScore();
        if(scoresum == null){
            scoresum = new long[]{0,0};
        }
        scoresum = finalContestScoreCalculator(finalScore,contest.getDifficulty(),scoresum);
        user.setTotalContestScore(scoresum);
        user.setContestFinalScore(Math.round((float) scoresum[0] / scoresum[1]));

        userRepository.save(user);
    }

    @Override
    public ContestResultDTO sendResult(String uId, String email, String cId){
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return new ContestResultDTO();
        }
        else{
            Map<String, ContestResultDTO> result  = contestResults.getResults();
            List<ContestLeaderBoardDTO> leaderBoardDTOS = contestResults.getContestLeaderBoardDTOS();
            if(result == null && leaderBoardDTOS != null){
                for (ContestLeaderBoardDTO dto : leaderBoardDTOS) {
                    if (dto.getEmail().equalsIgnoreCase(email)) {
                        return new ContestResultDTO(
                                dto.isViolation(), dto.isSubmitted(), dto.getFinishTime(),
                                dto.getPoints(), dto.getScore(), dto.getMaxScore(), dto.getSolved(),
                                dto.getFinalScore(), dto.getTimeDifference(), dto.getTimeTaken()
                        );
                    }
                }
            }
            assert result != null;
            return result.get(uId);
        }
    }

    private ContestLeaderBoardDTO getContestLeaderBoardDTO(Map.Entry<String, ContestResultDTO> entry, User user) {
        ContestResultDTO contestResultDTO = entry.getValue();
        return new ContestLeaderBoardDTO(
                user.getUname(),
                user.getEmail(),
                contestResultDTO.getProblemsSolved(),
                contestResultDTO.getTotalPoints(),
                contestResultDTO.getMaxPoints(),
                contestResultDTO.getCompletionTime(),
                contestResultDTO.getTimeTaken(),
                contestResultDTO.getFinalScore(),

                contestResultDTO.isViolation(),
                contestResultDTO.isSubmitted(),
                contestResultDTO.getPoints(),
                contestResultDTO.getTimeDifference()
        );
    }

    @Override
    public List<ContestLeaderBoardDTO> getContestLeaderBoard(String cId) {
        ContestResults contestResults = contestResultsRepository.findOneByContestId(cId);
        if(contestResults == null){
            return new ArrayList<>();
        }
        List<ContestLeaderBoardDTO> leaderBoardDTOS;
        if(contestResults.getContestLeaderBoardDTOS() == null){
            leaderBoardDTOS = new ArrayList<>();
            Map<String , ContestResultDTO> resultDTOMap = contestResults.getResults();
            for(Map.Entry<String, ContestResultDTO> entry : resultDTOMap.entrySet()){
                User user = userRepository.findOneById(entry.getKey());
                leaderBoardDTOS.add(getContestLeaderBoardDTO(entry, user));
            }
            //sorting based on 1 priority is higher final score and second is lesser time difference
            leaderBoardDTOS.sort((a, b) -> {
                // 1. Sort by finalScore descending
                int scoreCompare = Integer.compare(b.getFinalScore(), a.getFinalScore());
                if (scoreCompare != 0) return scoreCompare;

                // 2. If finalScore is equal, compare total time (minutes * 60 + seconds)
                int totalTimeA = a.getTimeDifference()[0] * 60 + a.getTimeDifference()[1];
                int totalTimeB = b.getTimeDifference()[0] * 60 + b.getTimeDifference()[1];
                return Integer.compare(totalTimeA, totalTimeB);
            });
            contestResults.setContestLeaderBoardDTOS(leaderBoardDTOS);
            contestResults.setResults(null);
            contestResultsRepository.save(contestResults);

            //deletion of contest submission entity as it is not needed after contest ends.
            contestSubmissionsRepository.deleteById(cId);
        }
        else{
            leaderBoardDTOS = contestResults.getContestLeaderBoardDTOS();
        }
        return leaderBoardDTOS;
    }
}
