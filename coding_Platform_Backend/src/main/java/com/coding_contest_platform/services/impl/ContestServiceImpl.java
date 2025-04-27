package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.contest.ContestDTO;
import com.coding_contest_platform.dto.contest.ContestProblemDTO;
import com.coding_contest_platform.dto.contest.ContestResultDTO;
import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.entity.Problem;
import com.coding_contest_platform.entity.ProblemData;
import com.coding_contest_platform.repository.ContestRepository;
import com.coding_contest_platform.repository.ContestResultsRepository;
import com.coding_contest_platform.repository.ProblemDataRepository;
import com.coding_contest_platform.repository.ProblemRepository;
import com.coding_contest_platform.services.ContestService;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final ProblemDataRepository problemDataRepository;
    private final UserServices userServices;
    private final ContestResultsRepository contestResultsRepository;

    @Transactional
    @Override
    public Contest createContest(Contest contest) {
        contest.setParticipants(0);
        contest.setEmailsParticipants(new ArrayList<>());
        return contestRepository.save(contest);
    }

    @Override
    public List<Contest> getAllContests(){
        return contestRepository.findAll();
    }

    @Override
    public Contest getContest(String id){
        return contestRepository.findOneById(id);
    }

    @Transactional
    @Override
    public void deleteContest(String contestId) {
        Contest contest = contestRepository.findOneById(contestId);
        contestRepository.delete(contest);
    }

    @Transactional
    @Override
    public Contest updateContest(Contest contest, String contestId) {
        Contest contest1 = contestRepository.findOneById(contestId);
        if(!contest.getDuration().equals("")){
            contest1.setDuration(contest.getDuration());
        }
        if(!contest.getDifficulty().equals("")){
            contest1.setDifficulty(contest.getDifficulty());
        }
        if(!contest.getTitle().equals("")){
            contest1.setTitle(contest.getTitle());
        }
        if(!contest.getDescription().equals("")){
            contest1.setDescription(contest.getDescription());
        }
        if(!contest.getStartDate().equals("")){
            contest1.setStartDate(contest.getStartDate());
        }
        if(!contest.getStartTime().equals("")){
            contest1.setStartTime(contest.getStartTime());
        }
        if(!contest.getRules().equals("")){
            contest1.setRules(contest.getRules());
        }
        contest1.setProblems(contest.getProblems());
        contest1.setSaveAsDraft(contest.isSaveAsDraft());
        return contestRepository.save(contest1);
    }

    @Override
    public ContestDTO getContestDetails(String id){
        Contest contest = contestRepository.findOneById(id);
        List<ContestProblemDTO> problemList = new ArrayList<ContestProblemDTO>();
        for(String pId : contest.getProblems()){
            Problem problem = problemRepository.findOneById(pId);
            ProblemData problemData = problemDataRepository.findOneById(pId);
            ContestProblemDTO contestProblemDTO = new ContestProblemDTO(
                    problem.getId(),
                    problem.getTitle(),
                    problem.getDifficulty(),
                    problem.getTags(),
                    problemData.getDescription(),
                    problemData.getCodeTemplates()
            );
            problemList.add(contestProblemDTO);
        }
        return new ContestDTO(
                contest.getId(),
                contest.getTitle(),
                contest.getDescription(),
                contest.getStartDate(),
                contest.getStartTime(),
                contest.getDuration(),
                contest.getDifficulty(),
                contest.getParticipants(),
                problemList,
                contest.getEmailsParticipants(),
                contest.getRules()
        );
    }

    @Transactional
    @Override
    public void addParticipant(String id, String email){
        Contest contest = contestRepository.findOneById(id);
        List<String> emailList = contest.getEmailsParticipants();

        //creation of map of problem and their points
        //initially 0
        List<String> problems = contest.getProblems();
        Map<String,Integer> points = new HashMap<>();
        for(String problemIds : problems){
            points.put(problemIds,0);
        }

        //creation of the contest result
        ContestResultDTO contestResultDTO = new ContestResultDTO();
        contestResultDTO.setViolation(false);
        contestResultDTO.setSubmitted(false);
        contestResultDTO.setCompletionTime("");
        contestResultDTO.setPoints(points);
        contestResultDTO.setTotalPoints(0);
        contestResultDTO.setProblemsSolved(0);

        if(emailList.isEmpty()){
            List<String> emailsParticipants = new ArrayList<>();
            emailsParticipants.add(email);
            contest.setEmailsParticipants(emailsParticipants);
            contest.setParticipants(contest.getParticipants() + 1);

            Map<String, ContestResultDTO> result  = new HashMap<>();
            result.put(userServices.getIdByEmail(email), contestResultDTO);

            ContestResults contestResult = new ContestResults();
            contestResult.setContestId(id);
            contestResult.setResults(result);
            contestResultsRepository.save(contestResult);
        }
        else{
            if(!emailList.contains(email)){
                emailList.add(email);
                contest.setParticipants(contest.getParticipants() + 1);
                contest.setEmailsParticipants(emailList);

                ContestResults contestResult = contestResultsRepository.findOneByContestId(id);
                Map<String, ContestResultDTO> result = contestResult.getResults();
                result.put(userServices.getIdByEmail(email), contestResultDTO);

                contestResult.setResults(result);
                contestResultsRepository.save(contestResult);
            }
        }
        contestRepository.save(contest);
    }
}
