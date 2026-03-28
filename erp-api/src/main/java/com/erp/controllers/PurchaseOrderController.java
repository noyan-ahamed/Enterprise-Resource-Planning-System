package com.erp.controllers;


import com.erp.dto.PurchaseOrderHeaderDTO;
import com.erp.enities.PurchaseOrderHeader;
import com.erp.enums.PurchaseStatus;
import com.erp.services.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseService;

    // Create Purchase Order
    @PostMapping
    public ResponseEntity<PurchaseOrderHeader> createPurchase(
            @RequestBody PurchaseOrderHeaderDTO dto
    ) {
        return ResponseEntity.ok(purchaseService.createPurchase(dto));
    }

    // Get All Purchase Orders
    @GetMapping
    public ResponseEntity<List<PurchaseOrderHeader>> getAllOrders() {
        return ResponseEntity.ok(purchaseService.getAllOrders());
    }

    // Get Single Purchase Order
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderHeader> getOrderById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(purchaseService.getById(id));
    }

    // Update Status
    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderHeader> updateStatus(
            @PathVariable Long id,
            @RequestParam PurchaseStatus status
    ) {
        return ResponseEntity.ok(purchaseService.updateStatus(id, status));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Long id
    ) {
        purchaseService.delete(id);
        return ResponseEntity.ok("Purchase order deleted");
    }

}