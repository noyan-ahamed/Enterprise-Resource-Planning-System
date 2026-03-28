package com.erp.services;

import com.erp.dto.SupplierDTO;
import com.erp.enities.Supplier;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SupplierService {
    List<Supplier> getAllSupliers();
   Supplier createSupplier(Supplier supplier);

   void deleteSupplier(long id);
    Supplier updateSupplier(Long id, SupplierDTO dto);

}
