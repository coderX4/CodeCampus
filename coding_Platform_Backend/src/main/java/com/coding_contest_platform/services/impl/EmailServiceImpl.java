package com.coding_contest_platform.services.impl;

import com.coding_contest_platform.helper.DynamicMailSender;
import com.coding_contest_platform.services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final DynamicMailSender dynamicMailSender;

    @Value("${google.account}")
    private String googleAccount;

    @Value("${google.account.appPassword}")
    private String googleAccountAppPassword;

    //verification mailer from the scm app
    @Override
    public void sendEmail(String to, String subject, String body) {

        JavaMailSender mailSender = dynamicMailSender.getMailSender(
                googleAccount, googleAccountAppPassword
        );

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(googleAccount);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Override
    public void sendAllEmail(List<String> to, String subject, String body) {
        JavaMailSender mailSender = dynamicMailSender.getMailSender(
                googleAccount, googleAccountAppPassword
        );

        int batchSize = 10; // Max emails per batch
        for (int i = 0; i < to.size(); i += batchSize) {
            // Get a sublist of 10 emails or remaining emails if less than 10
            List<String> batch = to.subList(i, Math.min(i + batchSize, to.size()));

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(googleAccount);
            message.setTo(batch.toArray(new String[0])); // Convert to array
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message); // Send the batch
        }
    }

}
