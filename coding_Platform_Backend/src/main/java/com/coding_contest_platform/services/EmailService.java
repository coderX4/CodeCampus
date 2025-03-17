package com.coding_contest_platform.services;

import java.util.List;

public interface EmailService {
    //email to single person
    void sendEmail(String to, String subject, String body);

    void sendAllEmail(List<String> to, String subject, String body);
}