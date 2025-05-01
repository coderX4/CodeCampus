package com.coding_contest_platform.dto.login_signup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminRegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String department;
}
