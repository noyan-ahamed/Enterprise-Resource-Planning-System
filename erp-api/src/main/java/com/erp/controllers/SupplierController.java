package com.erp.controllers;

import com.erp.dto.SupplierDTO;
import com.erp.enities.Supplier;
import com.erp.services.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping({"","/"})
    public ResponseEntity<List<Supplier>> getAllSupplier(){
        List<Supplier> suppliers = supplierService.getAllSupliers();
        return ResponseEntity.ok(suppliers);
    }

    @PostMapping("/create-supplier")
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier){
        return ResponseEntity.ok(supplierService.createSupplier(supplier));
    }

    @PutMapping("/update-supplier/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id,
            @RequestBody SupplierDTO dto) {

        return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
    }


    @DeleteMapping("/delete-supplier/{id}")
    public void deleteSupplier(@PathVariable long id){
        supplierService.deleteSupplier(id);
    }


}
