package com.coding_contest_platform.entity;

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

    public User(String uname, String email, String encode, Role role) {
        this.uname = uname;
        this.email = email;
        this.password = encode;
        this.role = role;
    }
}
