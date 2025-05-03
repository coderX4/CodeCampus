package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.Contest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContestRepository extends MongoRepository<Contest, String> {
    Contest findOneById(String id);
    Contest findOneByTitle(String title);
}
