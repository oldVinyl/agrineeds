package quantumloop.agrineeds.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import quantumloop.agrineeds.entities.Order;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
