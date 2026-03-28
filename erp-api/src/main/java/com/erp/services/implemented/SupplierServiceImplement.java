package com.erp.services.implemented;

import com.erp.dto.SupplierDTO;
import com.erp.enities.Supplier;
import com.erp.repositories.SupplierRepository;
import com.erp.services.SupplierService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImplement implements SupplierService {

    private final SupplierRepository supplierRepo;

    public SupplierServiceImplement(SupplierRepository supplierRepo) {
        this.supplierRepo = supplierRepo;
    }

    @Override
    public List<Supplier> getAllSupliers() {
        return supplierRepo.findAll(Sort.by(Sort.Direction.ASC,"id"));
    }

    @Override
    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepo.save(supplier);
    }

    @Override
    public void deleteSupplier(long id) {
        supplierRepo.deleteById(id);
    }

    @Override
    public Supplier updateSupplier(Long id, SupplierDTO dto) {

        Supplier supplier = supplierRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setName(dto.getName());
        supplier.setMobileNumber(dto.getMobileNumber());
        supplier.setAddress(dto.getAddress());
        supplier.setCompanyName(dto.getCompanyName());
        supplier.setTinNumber(dto.getTinNumber());
        supplier.setPaymentTerms(dto.getPaymentTerms());
        supplier.setRating(dto.getRating());
        supplier.setBankAccount(dto.getBankAccount());
        supplier.setBkashNo(dto.getBkashNo());

        return supplierRepo.save(supplier);
    }

}
