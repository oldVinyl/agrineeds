package quantumloop.agrineeds.services;

import org.springframework.stereotype.Service;
import quantumloop.agrineeds.entities.Product;
import quantumloop.agrineeds.repositories.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    /** GET /products */
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    /** POST /products */
    public Product createProduct(Product product) {
        return repo.save(product);
    }

    /** PATCH /products/{id} */
    public Product updateProduct(UUID id, Product updates) {
        return repo.findById(id).map(p -> {
            if (updates.getName() != null) p.setName(updates.getName());
            if (updates.getPriceCents() != null) p.setPriceCents(updates.getPriceCents());
            if (updates.getIsActive() != null) p.setIsActive(updates.getIsActive());
            if (updates.getDescription() != null) p.setDescription(updates.getDescription());
            if (updates.getImageUrl() != null) p.setImageUrl(updates.getImageUrl());
            if (updates.getCategory() != null) p.setCategory(updates.getCategory());
            if (updates.getSku() != null) p.setSku(updates.getSku());
            if (updates.getStock() != null) p.setStock(updates.getStock());
            return repo.save(p);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    /** DELETE /products/{id} */
    public void deleteProduct(UUID id) {
        repo.deleteById(id);
    }
}
