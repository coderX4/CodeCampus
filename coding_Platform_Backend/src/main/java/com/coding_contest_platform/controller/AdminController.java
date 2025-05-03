package com.coding_contest_platform.controller;

import com.coding_contest_platform.dto.login_signup.AdminRegisterRequest;
import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import com.coding_contest_platform.helper.Role;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.services.EmailService;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping({"/api/admin"})
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final UserServices usersService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @GetMapping({"/getallusers"})
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @PostMapping({"/createuser"})
    public ResponseEntity<User> saveUsers(@RequestBody AdminRegisterRequest request) {
        return ResponseEntity.ok(usersService.createUser(request,Provider.SYSTEM));
    }

    @PutMapping({"/updateuser/{email}"})
    public ResponseEntity<User> updateUser(@PathVariable("email") String email,@RequestBody AdminRegisterRequest request){
        return ResponseEntity.ok(usersService.updateUser(email,request));
    }

    @PostMapping({"/action/{action}"})
    public ResponseEntity<String> handleBulkAction(@PathVariable("action") String action,
                                                   @RequestBody Map<String, List<String>> request) {
        List<String> emails = request.get("emails"); // Extract the list from the JSON body

        switch (action) {
            case "deactivate" -> {
                for (String email : emails) {
                    User user = userRepository.findByEmail(email);
                    user.setStatus("inactive");
                    userRepository.save(user);
                }
            }
            case "activate" -> {
                for (String email : emails) {
                    User user = userRepository.findByEmail(email);
                    user.setStatus("active");
                    userRepository.save(user);
                }
            }
            case "deleteusers" -> {
                for (String email : emails) {
                    User user = userRepository.findByEmail(email);
                    userRepository.delete(user);
                }
            }
            default -> {
                for (String email : emails) {
                    User user = userRepository.findByEmail(email);
                    if (user.getRole().equals(Role.ADMIN)) {
                        user.setRole(Role.USER);
                    }
                    else{
                        user.setRole(Role.ADMIN);
                    }
                    userRepository.save(user);
                }
            }
        }
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/sendmail")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, Object> request) {
        // Extract recipients, subject, and message
        List<String> recipients = (List<String>) request.get("recipients");
        String subject = (String) request.get("subject");
        String message = (String) request.get("message");

        if (recipients == null || recipients.isEmpty() || subject == null || message == null) {
            return ResponseEntity.badRequest().body("Invalid email data");
        }

        // Send emails in batches of 10
        emailService.sendAllEmail(recipients, subject, message);

        return ResponseEntity.ok("Emails sent successfully!");
    }

}
