package com.coding_contest_platform.dto.login_signup;

import com.coding_contest_platform.helper.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String uname;
    private String email;
    private Role role;
}
