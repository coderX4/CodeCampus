package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.entity.Contest;
import com.coding_contest_platform.repository.ContestRepository;
import com.coding_contest_platform.services.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {
    private final ContestRepository contestRepository;

    @Transactional
    @Override
    public Contest createContest(Contest contest) {
        contest.setParticipants((int) contest.getParticipants());
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
}
