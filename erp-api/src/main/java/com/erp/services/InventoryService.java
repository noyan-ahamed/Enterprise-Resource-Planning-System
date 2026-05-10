package com.erp.services;

import com.erp.enities.Product;

public interface InventoryService {

    void consumeStock(Product product, Integer sellQty);
}