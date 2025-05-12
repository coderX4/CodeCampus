package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.ProblemTagsList;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemTagsListRepository extends MongoRepository<ProblemTagsList, String> {
    ProblemTagsList findOneById(String id);
}
