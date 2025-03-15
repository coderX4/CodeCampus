package com.coding_contest_platform.dto;

import com.coding_contest_platform.entity.Role;
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
