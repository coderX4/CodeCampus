package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends MongoRepository<Problem, String> {
    // Find the latest problem ID that starts with the given prefix (sorted in descending order)
    @Query(value = "{'id': {$regex: ?0, $options: 'i'}}", sort = "{'id': -1}")
    String findLatestProblemId(String prefix);

    Problem findOneById(String id);

    List<Problem> findByStatus(String status);

}
