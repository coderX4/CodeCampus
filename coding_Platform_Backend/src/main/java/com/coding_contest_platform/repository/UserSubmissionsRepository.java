package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.UserSubmissions;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserSubmissionsRepository extends MongoRepository<UserSubmissions, String> {
    UserSubmissions findByEmail(String id);
}
