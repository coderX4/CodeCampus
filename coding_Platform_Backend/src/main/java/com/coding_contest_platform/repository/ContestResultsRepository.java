package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ContestResults;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContestResultsRepository extends MongoRepository<ContestResults, String> {
    ContestResults findOneByContestId(String contestId);
}
