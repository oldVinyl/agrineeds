package quantumloop.agrineeds.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    protected UUID id;

    @Column(name = "created_at", updatable = false, nullable = false)
    protected Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    protected Instant updatedAt;

    // JPA lifecycle hooks keep timestamps correct, no service code needed
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters (no setters for id/createdAt/updatedAt to avoid accidental overrides)
    public UUID getId() { return id; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
