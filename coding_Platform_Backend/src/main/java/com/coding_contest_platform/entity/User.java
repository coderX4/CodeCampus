package com.coding_contest_platform.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

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

    private Provider provider;

    private String status;

    private String joinDate;

    private String lastActive;

    public User(String uname, String email, String encode, Role role,Provider provider, String status, String joinDate, String lastActive) {
        this.uname = uname;
        this.email = email;
        this.password = encode;
        this.role = role;
        this.provider = provider;
        this.status = status;
        this.joinDate = joinDate;
        this.lastActive = lastActive;
    }
}
