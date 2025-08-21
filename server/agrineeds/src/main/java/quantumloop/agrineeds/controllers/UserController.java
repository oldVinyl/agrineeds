package quantumloop.agrineeds.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import quantumloop.agrineeds.entities.User;
import quantumloop.agrineeds.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET user by id
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id);
    }

    // CREATE new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // UPDATE user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
    }
}

/* ENDPOINTS
*   /api/users → fetch all
*   /api/users/{id} → fetch single
*   POST /api/users → create
*   PUT /api/users/{id} → update
*   DELETE /api/users/{id} → delete
*/