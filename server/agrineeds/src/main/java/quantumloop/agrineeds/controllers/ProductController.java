package quantumloop.agrineeds.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import quantumloop.agrineeds.entities.Product;
import quantumloop.agrineeds.services.ProductService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET /products
    @GetMapping
    public List<Product> getAll() {
        return service.getAllProducts();
    }

    // POST /products
    @PostMapping
    public Product create(@RequestBody Product product) {
        return service.createProduct(product);
    }

    // PATCH /products/{id}
    @PatchMapping("/{id}")
    public Product update(@PathVariable UUID id, @RequestBody Product updates) {
        return service.updateProduct(id, updates);
    }

    // DELETE /products/{id}
    // NOTE: frontend expects JSON (api.js calls res.json()); return { ok: true }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable UUID id) {
        service.deleteProduct(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
