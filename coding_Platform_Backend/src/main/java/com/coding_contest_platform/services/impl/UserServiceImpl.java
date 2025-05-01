package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.dto.login_signup.AdminRegisterRequest;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import com.coding_contest_platform.helper.Role;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServices {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public User saveUsers(User user) {
        User newUser = new User();
        newUser.setUname(user.getUname());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        return userRepository.save(newUser); // Collection is created automatically if it doesn't exist
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public String getIdByEmail(String email) {
        User user = getUserByEmail(email);
        return user.getId();
    }

    public Role assignRole(String role){
        return switch (role){
            case "ADMIN" -> Role.ADMIN;
            case "MODERATOR" -> Role.MODERATOR;
            default -> Role.USER;
        };
    }

    @Override
    public Department assignDepartment(String department){
        return switch (department) {
            case "ADMIN" -> Department.ADMIN;
            case "DS" -> Department.DS;
            case "AIML" -> Department.AIML;
            case "AI" -> Department.AI;
            case "ML" -> Department.ML;
            case "CSBS" -> Department.CSBS;
            case "ME" -> Department.ME;
            case "BIOTECH" -> Department.BIOTECH;
            case "ECE" -> Department.ECE;
            case "IOT" -> Department.IOT;
            default -> Department.CSE;
        };
    }

    @Transactional
    @Override
    public User createUser(AdminRegisterRequest request, Provider provider) {
        String uname = request.getFirstName() + " " + request.getLastName();

        LocalDate date = LocalDate.now(); // Get current date
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Define format
        String formattedDate = date.format(dateFormatter);

        User user = new User(uname, request.getEmail(),
                passwordEncoder.encode(request.getPassword()), assignRole(request.getRole()),
                assignDepartment(request.getDepartment()), provider,"active",
                formattedDate,formattedDate,0,0
        );
        userRepository.save(user);
        return user;
    }

    @Transactional
    @Override
    public User updateUser(String email, AdminRegisterRequest request) {
        User user = userRepository.findByEmail(email);
        String uname = request.getFirstName() + " " + request.getLastName();
        user.setUname(uname);

        if(!request.getRole().equals("")){
            user.setRole(assignRole(request.getRole()));
        }
        if(!request.getDepartment().equals("")){
            user.setDepartment(assignDepartment(request.getDepartment()));
        }

        String password = request.getPassword();
        if(password != null){
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        return user;
    }
}
