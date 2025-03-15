package com.coding_contest_platform.controller;


import com.coding_contest_platform.dto.AdminRegisterRequest;
import com.coding_contest_platform.entity.Role;
import com.coding_contest_platform.entity.User;
import com.coding_contest_platform.repository.UserRepository;
import com.coding_contest_platform.security.JwtService;
import com.coding_contest_platform.dto.AuthRequest;
import com.coding_contest_platform.dto.AuthResponse;
import com.coding_contest_platform.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    /** REGISTER NEW USER */
    @PostMapping("/admin-register")
    public ResponseEntity<?> adminRegistration(@RequestBody AdminRegisterRequest request, HttpServletResponse response) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        String uname = request.getFirstName() + " " + request.getLastName();
        User user = new User(uname, request.getEmail(),
                passwordEncoder.encode(request.getPassword()), Role.ADMIN);
        userRepository.save(user);

        // Generate JWT token and store it in an HTTP-only cookie
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(new AuthResponse(token, uname, request.getEmail(),user.getRole()));
    }

    /** REGISTER NEW USER */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        String uname = request.getFirstName() + " " + request.getLastName();
        User user = new User(uname, request.getEmail(),
                passwordEncoder.encode(request.getPassword()), Role.USER);
        userRepository.save(user);

        // Generate JWT token and store it in an HTTP-only cookie
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(new AuthResponse(token, uname, request.getEmail(),user.getRole()));
    }

    /** LOGIN USER */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail());
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(new AuthResponse(token,user.getUname(), user.getEmail(),user.getRole()));
    }

    /** OAuth2 SUCCESS HANDLER */
    @GetMapping("/oauth-success/{email}")
    public ResponseEntity<?> oauthSuccess(@PathVariable("email") String email, HttpServletResponse response) {

        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "OAuth login failed"));
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Set the JWT as an HTTP-only cookie
        setCookie(response, token);

        // Return user details in the response
        return ResponseEntity.ok(new AuthResponse(token, user.getUname(), user.getEmail(),user.getRole()));
    }


    /** LOGOUT USER (Clears cookie) */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire the cookie immediately
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /** HELPER METHOD TO SET JWT IN HTTP-ONLY COOKIE */
    private void setCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Enable only for HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day expiration
        response.addCookie(cookie);
    }
}

