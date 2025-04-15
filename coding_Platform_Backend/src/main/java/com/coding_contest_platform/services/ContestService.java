package com.coding_contest_platform.services;

import com.coding_contest_platform.entity.Contest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ContestService {
    Contest createContest(Contest contest);

    List<Contest> getAllContests();

    Contest getContest(String id);

    @Transactional
    void deleteContest(String contestId);
}
