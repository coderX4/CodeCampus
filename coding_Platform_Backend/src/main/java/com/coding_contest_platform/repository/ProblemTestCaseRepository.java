package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ProblemTestCase;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemTestCaseRepository extends MongoRepository<ProblemTestCase, String> {
    ProblemTestCase findOneById(String id);
}
