package com.coding_contest_platform.controller;

import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping({"/api/users"})
@RequiredArgsConstructor
public class UserController {

    private final UserServices usersService;

    @PostMapping({"/adduser"})
    public ResponseEntity<User> saveUsers(@RequestBody User user) {
        return ResponseEntity.ok(usersService.saveUsers(user));
    }

    @GetMapping({"/message"})
    public String getMessage() {
        return "Hello World";
    }
}
