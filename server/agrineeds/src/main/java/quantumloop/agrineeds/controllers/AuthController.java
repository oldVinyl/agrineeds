package quantumloop.agrineeds.controllers;

import org.springframework.web.bind.annotation.*;
import quantumloop.agrineeds.entities.User;
import quantumloop.agrineeds.models.LoginRequest;
import quantumloop.agrineeds.repositories.UserRepository;

import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository users;

    public AuthController(UserRepository users) {
        this.users = users;
    }

    // POST /auth/login  body: { "username": "...", "password": "..." }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        if (req == null || req.getUsername() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("username and password are required");
        }

        User user = users.findByEmail(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // For now a simple token; frontend doesn't send it back anywhere yet
        String token = UUID.randomUUID().toString();

        // frontend expects: { token, user: { id, role, username } }
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("token", token);
        resp.put("user", Map.of(
                "id", user.getId(),
                "role", user.getRole(),
                "username", user.getEmail()  // map email -> username field expected by ui
        ));
        return resp;
    }

    // POST /auth/logout  -> { ok: true }
    @PostMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of("ok", true);
    }
}