package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.leaderboard.GlobalLeaderBoardDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.ContestRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.services.LeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderBoardServiceImpl implements LeaderBoardService {
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;

    private int[] getNumberProblemsAndMaxProblemScore() {
        List<Problem> problems = problemRepository.findByStatus("active");;
        int maxTotalProblemScore = 0;
        for (Problem problem : problems) {
            switch (problem.getDifficulty()) {
                case "easy":{
                    maxTotalProblemScore += 100;
                    break;
                }
                case "medium":{
                    maxTotalProblemScore += 200;
                    break;
                }
                case "hard":{
                    maxTotalProblemScore += 300;
                    break;
                }
            }
        }
        return new int[]{maxTotalProblemScore,problems.size()};
    }

    private int getNumberOfContests() {
        List<Contest> contestList = contestRepository.findAll();
        return contestList.size();
    }

    private int calcLeaderBoardScore(int finalContestScore,
                                    int totalProblemScore,
                                    int totalProblemsSolved,
                                    int totalContestsParticipated) {

        int[] numberProblemsAndMaxProblemScore = getNumberProblemsAndMaxProblemScore();
        int maxPossibleProblemScore = numberProblemsAndMaxProblemScore[0];
        int maxPossibleProblems = numberProblemsAndMaxProblemScore[1];

        int maxPossibleContests = getNumberOfContests();

        if (maxPossibleProblemScore == 0 || maxPossibleProblems == 0 || maxPossibleContests == 0)
            return 0;

        // Normalize ratios (0.0 to 1.0)
        double problemScoreRatio = (double) totalProblemScore / maxPossibleProblemScore;
        double normalizedProblemCount = (double) totalProblemsSolved / maxPossibleProblems;
        double normalizedContestCount = (double) totalContestsParticipated / maxPossibleContests;

        // Scale to 0–1000
        problemScoreRatio *= 1000;
        normalizedProblemCount *= 1000;
        normalizedContestCount *= 1000;

        // Weighted formula
        double totalScore =
                (finalContestScore * 0.5) +
                        (problemScoreRatio * 0.3) +
                        (normalizedProblemCount * 0.1) +
                        (normalizedContestCount * 0.1);

        return (int) Math.round(totalScore);
    }

    @Transactional
    @Override
    public void updateLeaderBoardScore(String email) {
        User user = userRepository.findByEmail(email);
        int totalProblemScore = user.getProblemFinalScore();
        int finalContestScore = user.getContestFinalScore();
        int totalProblemsSolved = user.getProblems();
        int totalContestsParticipated = user.getContests();

        user.setFinalLeaderBoardScore(
                calcLeaderBoardScore(
                        finalContestScore,
                        totalProblemScore,
                        totalProblemsSolved,
                        totalContestsParticipated
                )
        );
        userRepository.save(user);
    }

    @Override
    public List<GlobalLeaderBoardDTO> getGlobalLeaderBoardDTO() {
        List<GlobalLeaderBoardDTO> globalLeaderBoardDTOList = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            GlobalLeaderBoardDTO globalLeaderBoardDTO = new GlobalLeaderBoardDTO(
                    user.getUname(), user.getEmail(), user.getDepartment(),
                    user.getProblems(), user.getContests(),
                    user.getProblemFinalScore(), user.getContestFinalScore(),
                    user.getFinalLeaderBoardScore()
            );
            globalLeaderBoardDTOList.add(globalLeaderBoardDTO);
        }
        globalLeaderBoardDTOList.sort((a, b) -> {
            // 1. Sort by finalScore descending
            int leaderBoardScoreCompare = Integer.compare(b.getFinalLeaderBoardScore(), a.getFinalLeaderBoardScore());
            if (leaderBoardScoreCompare != 0) return leaderBoardScoreCompare;

            //2. Sort by contest finalScores descending
            int contestScoreCompare = Integer.compare(b.getContestFinalScore(), a.getContestFinalScore());
            if (contestScoreCompare != 0) return contestScoreCompare;

            //3. Sort by problem finalScores descending
            return Integer.compare(b.getProblemFinalScore(), a.getProblemFinalScore());
        });
        return globalLeaderBoardDTOList;
    }
}
