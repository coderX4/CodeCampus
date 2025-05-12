package com.coding_contest_platform.services;

import com.coding_contest_platform.dto.login_signup.AdminRegisterRequest;
import com.coding_contest_platform.dto.mainsection.MainSectionDTO;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface UserServices {

    List<User> getAllUsers();

    User getUserByEmail(String email);

    String getIdByEmail(String email);

    Department assignDepartment(String department);

    @Transactional
    User createUser(AdminRegisterRequest request, Provider provider);

    @Transactional
    User updateUser(String email, AdminRegisterRequest request);

    @Transactional
    void makeProgressDTOMap(User user);

    MainSectionDTO sendMainSection(String email);
}
