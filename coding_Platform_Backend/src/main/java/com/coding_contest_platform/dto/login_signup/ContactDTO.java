package com.coding_contest_platform.dto.login_signup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactDTO {
    private String name;
    private String email;
    private String subject;
    private String message;
}
