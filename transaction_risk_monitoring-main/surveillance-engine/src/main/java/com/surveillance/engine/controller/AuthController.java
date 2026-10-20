package com.surveillance.engine.controller;

import com.surveillance.engine.model.User;
import com.surveillance.engine.repository.UserRepository;
import com.surveillance.engine.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

   // @Autowired
    //private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String role = request.get("role");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        if (!password.equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }

        if (!role.equals(user.getRole())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid role"));
        }

        String token = jwtUtil.generateToken(username, role);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", username,
            "role", role
        ));
    }
}
