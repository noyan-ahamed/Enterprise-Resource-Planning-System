package com.erp.services.implemented;

import com.erp.dto.ProductDTO;
import com.erp.enities.Product;
import com.erp.enities.ProductStock;
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

    private final ProductStockRepository stockRepo;

    @Override
    public List<Product> getAllProduct() {
        return productRepo.findAll();
    }

    @Override
    public ResponseEntity<Product> createProduct(Product product) {

        // ১. আগে product save
        Product savedProduct = productRepo.save(product);

        // ২. তারপর stock create
        ProductStock stock = new ProductStock();
        stock.setProduct(savedProduct);
        stock.setQuantity(0); // default 0

        stockRepo.save(stock);

        return ResponseEntity.ok(savedProduct);
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
