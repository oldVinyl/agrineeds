package quantumloop.agrineeds.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantumloop.agrineeds.entities.Order;
import quantumloop.agrineeds.entities.OrderItem;
import quantumloop.agrineeds.entities.OrderStatus;
import quantumloop.agrineeds.repositories.OrderRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    /** GET /orders */
    public List<Order> getOrders() {
        return repo.findAll();
    }

    /** POST /orders */
    @Transactional
    public Order createOrder(Order order) {
        // ensure FK is set on each item
        if (order.getItems() != null) {
            for (OrderItem it : order.getItems()) {
                it.setOrder(order);
            }
        }
        // status defaults to PENDING from entity; frontend may send it too
        return repo.save(order);
    }

    /** PATCH /orders/{id} — only status changes */
    @Transactional
    public Order updateOrderStatus(UUID id, OrderStatus status) {
        return repo.findById(id).map(o -> {
            o.setStatus(status);
            return repo.save(o);
        }).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    /** GET /oders/{id} - get buy id */
    @Transactional
    public Optional<Order> findById(UUID id) {
        return repo.findById(id);
    }
}
