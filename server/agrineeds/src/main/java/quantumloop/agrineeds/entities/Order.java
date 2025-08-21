package quantumloop.agrineeds.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

// On your entities (Order, OrderItem, Product)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    // Order.java
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();


    @Column(length = 500)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    // Getters & setters
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) {
        this.items.clear();
        if (items != null) {
            items.forEach(i -> i.setOrder(this)); // ensure FK is set
            this.items.addAll(items);
        }
    }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
