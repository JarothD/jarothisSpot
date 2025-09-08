package com.jarothi.spot.jarothispot.auth.controller;

import com.jarothi.spot.jarothispot.auth.jwt.JwtService;
import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            Map<String, Object> claims = Map.of(
                "roles", user.getRoles()
            );
            String token = jwtService.generateToken(user.getEmail(), claims);

            return ResponseEntity.ok(Map.of(
                    "accessToken", token,
                    "email", user.getEmail(),
                    "roles", user.getRoles()
            ));
        } catch (AuthenticationException e) {

            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal error"));
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
