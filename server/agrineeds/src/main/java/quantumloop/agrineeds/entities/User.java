package quantumloop.agrineeds.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;   // frontend login uses "username" but we map it to this

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;    // e.g. "ADMIN"

    // Getters & setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
