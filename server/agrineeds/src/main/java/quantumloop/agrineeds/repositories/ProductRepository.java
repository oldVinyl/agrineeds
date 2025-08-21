package quantumloop.agrineeds.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import quantumloop.agrineeds.entities.Product;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}
