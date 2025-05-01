package com.coding_contest_platform.entity;

import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import com.coding_contest_platform.helper.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@TypeAlias("Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;
    private String uname;

    @Indexed(unique = true)
    private String email;
    private String password;

    private Role role;

    private Department department;

    private Provider provider;

    private String status;

    private String joinDate;

    private String lastActive;

    private int problems;

    private int contests;

    public User(String uname, String email, String encode, Role role,
                Department department,Provider provider, String status,
                String joinDate, String lastActive, int problems, int contests) {
        this.uname = uname;
        this.email = email;
        this.password = encode;
        this.role = role;
        this.department = department;
        this.provider = provider;
        this.status = status;
        this.joinDate = joinDate;
        this.lastActive = lastActive;
        this.problems = problems;
        this.contests = contests;
    }
}

