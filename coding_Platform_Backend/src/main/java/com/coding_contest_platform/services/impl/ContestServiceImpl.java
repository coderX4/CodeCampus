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
}
