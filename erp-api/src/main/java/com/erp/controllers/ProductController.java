package com.erp.controllers;

import com.erp.enities.Product;
import com.erp.enities.Supplier;
import com.erp.repositories.ProductRepository;
import com.erp.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {
    private final ProductService productService;

    @GetMapping("")
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products = productService.getAllProduct();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/create-product")
    public ResponseEntity<Product> createProduct(@RequestBody Product product){
        return productService.createProduct(product);
    }
}
