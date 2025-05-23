package com.coding_contest_platform.repository;

import com.coding_contest_platform.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findOneByEmail(String email);
    User findOneById(String id);
}
