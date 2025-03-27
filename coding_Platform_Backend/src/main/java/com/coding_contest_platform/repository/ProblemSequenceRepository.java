package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ProblemSequence;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemSequenceRepository extends MongoRepository<ProblemSequence, String> {
}
