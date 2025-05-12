package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.mainsection.MainSectionDTO;
import com.coding_contest_platform.dto.mainsection.ProgressDTO;
import com.coding_contest_platform.entity.ProblemTagsList;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.ProblemTagsListRepository;
import com.coding_contest_platform.services.ProblemService;
import com.coding_contest_platform.services.UserServices;
import com.coding_contest_platform.services.UserSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping({"/api/users"})
@RequiredArgsConstructor
public class UserController {

    private final UserServices usersService;
    private final ProblemTagsListRepository problemTagsListRepository;


    @GetMapping({"/savetagList"})
    public ResponseEntity<?> saveTagList() {
        ProblemTagsList problemTagsList = new ProblemTagsList();
        Map<String, Integer> mapTagList= new HashMap<>();
        mapTagList.put("Array" , 0);
        mapTagList.put("Strings" , 0);
        mapTagList.put("Hash Table" , 0);
        mapTagList.put("Linked List" , 0);
        mapTagList.put("Math" , 0);
        mapTagList.put("Dynamic Programming" , 0);
        mapTagList.put("Sorting" , 0);
        mapTagList.put("Greedy" , 0);
        mapTagList.put("Binary Search" , 0);
        mapTagList.put("Trees" , 0);
        mapTagList.put("Tries" , 0);
        mapTagList.put("Graphs" , 0);
        mapTagList.put("Bit Manipulation" , 0);
        problemTagsList.setId("1");
        problemTagsList.setProblemTagsList(mapTagList);
        problemTagsListRepository.save(problemTagsList);
        return ResponseEntity.ok(problemTagsList);
    }

    @GetMapping({"/getUserData/{email}"})
    public ResponseEntity<MainSectionDTO> getUserData(@PathVariable("email") String email) {
        return ResponseEntity.ok(usersService.sendMainSection(email));
    }

}
