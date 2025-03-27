package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ProblemData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemDataRepository extends MongoRepository<ProblemData, String> {
    ProblemData findOneById(String id);
}
