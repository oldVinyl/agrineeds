package quantumloop.agrineeds.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

// On your entities (Order, OrderItem, Product)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long priceCents; // aligns with frontend

    @Column(nullable = false)
    private Boolean isActive = true;

    // Getters & setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getPriceCents() { return priceCents; }
    public void setPriceCents(Long priceCents) { this.priceCents = priceCents; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
