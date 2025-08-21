package quantumloop.agrineeds.services;

import org.springframework.stereotype.Service;
import quantumloop.agrineeds.entities.User;
import quantumloop.agrineeds.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    /** Create admin/user */
    public User createUser(User user) {
        return repo.save(user);
    }

    /** List users */
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    /** Get by id */
    public Optional<User> getUserById(UUID id) {
        return repo.findById(id);
    }

    /** Update */
    public User updateUser(UUID id, User updates) {
        return repo.findById(id).map(u -> {
            if (updates.getEmail() != null) u.setEmail(updates.getEmail());
            if (updates.getPassword() != null) u.setPassword(updates.getPassword()); // plain for now
            if (updates.getRole() != null) u.setRole(updates.getRole());
            return repo.save(u);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    /** Delete */
    public void deleteUser(UUID id) {
        repo.deleteById(id);
    }

    /** For login */
    public Optional<User> getUserByEmail(String email) {
        return repo.findByEmail(email);
    }


}
