package com.erp.services.implemented;

import com.erp.dto.ProductDTO;
import com.erp.enities.Product;
import com.erp.repositories.ProductRepository;
import com.erp.repositories.ProductStockRepository;
import com.erp.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImplement implements ProductService {
    private final ProductRepository productRepo;

    @Override
    public List<Product> getAllProduct() {
        return productRepo.findAll();
    }

    @Override
    public ResponseEntity<Product> createProduct(Product product) {

        return ResponseEntity.ok(productRepo.save(product));
    }

    @Override
    public ResponseEntity<Product> updateProduct(ProductDTO productDTO) {
        return null;
    }

    @Override
    public void deleteProduct(long id) {
        productRepo.deleteById(id);
    }
}
