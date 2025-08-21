package quantumloop.agrineeds.controllers;

import org.springframework.web.bind.annotation.*;
import quantumloop.agrineeds.entities.Order;
import quantumloop.agrineeds.entities.OrderStatus;
import quantumloop.agrineeds.models.StatusDto;
import quantumloop.agrineeds.services.OrderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // GET /orders
    @GetMapping
    public List<Order> list() {
        return service.getOrders();
    }

    // POST /orders
    @PostMapping
    public Order create(@RequestBody Order order) {
        return service.createOrder(order);
    }

    // PATCH /orders/{id}  body: { "status": "CONFIRMED" }
    @PatchMapping("/{id}")
    public Order updateStatus(@PathVariable UUID id, @RequestBody StatusDto body) {
        if (body == null || body.getStatus() == null) {
            throw new IllegalArgumentException("status is required");
        }
        OrderStatus next = OrderStatus.valueOf(body.getStatus().toUpperCase());
        return service.updateOrderStatus(id, next);
    }
}
