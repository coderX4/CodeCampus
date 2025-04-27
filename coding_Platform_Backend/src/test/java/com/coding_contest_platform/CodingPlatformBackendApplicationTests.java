package com.coding_contest_platform;

import com.coding_contest_platform.entity.ContestResults;
import com.coding_contest_platform.repository.ContestResultsRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CodingPlatformBackendApplicationTests {

    @Autowired
    private ContestResultsRepository contestResultsRepository;

    @Test
    void contextLoads() {
        ContestResults contestResults = contestResultsRepository.findOneByContestId("67fe44a0f0278b0d57fac6e4");
        System.out.println(contestResults);
    }

}
