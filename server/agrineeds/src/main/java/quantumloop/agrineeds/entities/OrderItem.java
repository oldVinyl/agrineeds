package quantumloop.agrineeds.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.UUID;

// On your entities (Order, OrderItem, Product)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

// ...
@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    // OrderItem.java
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;


    // ✅ store as varchar; exactly what frontend sends
    @Column(name = "product_id", length = 36, nullable = false)
    private String productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long priceCents;

    @Column(nullable = false)
    private Integer qty;

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getPriceCents() { return priceCents; }
    public void setPriceCents(Long priceCents) { this.priceCents = priceCents; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
}
