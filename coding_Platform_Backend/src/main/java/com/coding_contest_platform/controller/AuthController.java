package com.coding_contest_platform.controller;


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
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    /** 🔹 REGISTER NEW USER */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        User user = new User(request.getUname(), request.getEmail(),
                passwordEncoder.encode(request.getPassword()), Role.USER);
        userRepository.save(user);

        // Generate JWT token and store it in an HTTP-only cookie
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    /** 🔹 LOGIN USER */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail());
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    /** 🔹 GOOGLE OAUTH2 SUCCESS */
    @GetMapping("/oauth-success")
    public ResponseEntity<?> googleOAuthSuccess(@RequestParam Map<String, String> params, HttpServletResponse response) {
        String email = params.get("email");
        String name = params.get("name");

        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User(null, name, email, "GOOGLE_AUTH", Role.USER);
            userRepository.save(user);
        }

        // Generate JWT token and store it in HTTP-only cookie
        String token = jwtService.generateToken(user);
        setCookie(response, token);

        return ResponseEntity.ok(Map.of("message", "Google login successful"));
    }

    /** 🔹 LOGOUT USER (Clears cookie) */
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

    /** 🔹 HELPER METHOD TO SET JWT IN HTTP-ONLY COOKIE */
    private void setCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Enable only for HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day expiration
        response.addCookie(cookie);
    }
}

