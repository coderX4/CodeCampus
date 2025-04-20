package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ContestSubmissions;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContestSubmissionsRepository extends MongoRepository<ContestSubmissions, String> {
    ContestSubmissions findOneByContestId(String contestId);
}
