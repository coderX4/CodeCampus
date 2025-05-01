package com.coding_contest_platform.security;

import com.coding_contest_platform.helper.Department;
import com.coding_contest_platform.helper.Provider;
import com.coding_contest_platform.helper.Role;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = oauthUser.getAttributes();

        String email;
        String name;

        if (attributes.containsKey("sub")) {
            email = (String) oauthUser.getAttributes().get("email");
            name = (String) oauthUser.getAttributes().get("name");

            LocalDate date = LocalDate.now(); // Get current date
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Define format
            String formattedDate = date.format(dateFormatter);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User(name, email, "GOOGLE_AUTH", Role.USER, Department.CSE,Provider.GOOGLE, "active", formattedDate, formattedDate,0,0);
                userRepository.save(user);
            }
            // Redirect to frontend, where it will call /oauth-success
            response.sendRedirect(frontendUrl+"/oauth-callback/"+user.getEmail());
        }
        else if (attributes.containsKey("login") && attributes.containsKey("id")) {
            email = oauthUser.getAttribute("email") != null ? oauthUser.getAttribute("email").toString()
                    : oauthUser.getAttribute("login").toString() + "@github.com";
            name = oauthUser.getAttribute("name") != null ? oauthUser.getAttribute("name").toString() : oauthUser.getAttribute("login").toString();

            LocalDate date = LocalDate.now(); // Get current date
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Define format
            String formattedDate = date.format(dateFormatter);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User(name, email, "GITHUB_AUTH", Role.USER,Department.CSE, Provider.GITHUB, "active", formattedDate, formattedDate,0,0);
                userRepository.save(user);
            }
            // Redirect to frontend, where it will call /oauth-success
            response.sendRedirect(frontendUrl+"/oauth-callback/"+user.getEmail());
        }
    }
}
