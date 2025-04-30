package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.MainSectionDTO;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.entity.UserSubmissions;
import com.coding_contest_platform.services.UserServices;
import com.coding_contest_platform.services.UserSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping({"/api/users"})
@RequiredArgsConstructor
public class UserController {

    private final UserServices usersService;
    private final UserSubmissionService userSubmissionService;

    @PostMapping({"/adduser"})
    public ResponseEntity<User> saveUsers(@RequestBody User user) {
        return ResponseEntity.ok(usersService.saveUsers(user));
    }

    @GetMapping({"/message"})
    public String getMessage() {
        return "Hello World";
    }

    @GetMapping({"/getUserData/{email}"})
    public ResponseEntity<MainSectionDTO> getUserData(@PathVariable("email") String email) {
        MainSectionDTO mainSectionDTO = userSubmissionService.sendMainSection(email);
        return ResponseEntity.ok(mainSectionDTO);
    }
}
