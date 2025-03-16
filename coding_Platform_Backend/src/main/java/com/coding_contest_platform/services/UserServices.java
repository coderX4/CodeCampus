package com.coding_contest_platform.services;

import com.coding_contest_platform.entity.User;
import java.util.List;


public interface UserServices {
    User saveUsers(User user);

    List<User> getAllUsers();
}
