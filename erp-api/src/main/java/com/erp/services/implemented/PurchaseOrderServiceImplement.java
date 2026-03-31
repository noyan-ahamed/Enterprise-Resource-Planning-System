package com.erp.services.implemented;

import com.erp.dto.PurchaseItemDTO;
import com.erp.dto.PurchaseOrderHeaderDTO;
import com.erp.enities.*;
import com.erp.enums.PurchaseStatus;
import com.erp.repositories.ProductRepository;
import com.erp.repositories.ProductStockRepository;
import com.erp.repositories.PurchaseOrderHeaderRepository;
import com.erp.repositories.SupplierRepository;
import com.erp.services.LedgerService;
import com.erp.services.PurchaseOrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImplement implements PurchaseOrderService {
    //supplier repo
    private final SupplierRepository supplierRepo;
    //invoice
    private final InvoiceNumberServiceImplement invoice;
    private final ProductRepository productRepo;
    private final PurchaseOrderHeaderRepository purchaseRepo;

    private final ProductStockRepository stockRepo;

    private final LedgerService ledgerService;

    @Override
    @Transactional
    public PurchaseOrderHeader createPurchase(PurchaseOrderHeaderDTO dto) {

        Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrderHeader order = new PurchaseOrderHeader();
        order.setSupplier(supplier);
        order.setInvoiceNumber(invoice.generate("SUP"));

        BigDecimal total = BigDecimal.ZERO;

        List<PurchaseOrderItem> items = new ArrayList<>();

        for(PurchaseItemDTO itemDTO : dto.getItems()){

            Product product = productRepo.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());
            item.setPurchaseOrderHeader(order);
            item.setUnit(itemDTO.getUnit());

            BigDecimal lineTotal = itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            item.setLineTotal(lineTotal);

            total = total.add(lineTotal);
            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);
        order.setStatus(PurchaseStatus.PENDING);
        order.setPaymentTerms(dto.getPaymentTerms());
        order.setCreated_at(LocalDate.now());


        return purchaseRepo.save(order);
    }

    @Transactional
    public PurchaseOrderHeader updateStatus(Long orderId, PurchaseStatus status) {
        PurchaseOrderHeader order = purchaseRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // RECEIVED ba CANCELED hoye gele ar status change kora jabe na
        if(order.getStatus() == PurchaseStatus.RECEIVED || order.getStatus() == PurchaseStatus.CANCELED) {
            throw new RuntimeException("Order is already " + order.getStatus() + " and cannot be modified.");
        }

        order.setStatus(status);

        if (status == PurchaseStatus.RECEIVED) {
            for (PurchaseOrderItem item : order.getItems()) {
                Product product = item.getProduct();

                // ১. স্টক আপডেট
                ProductStock stock = stockRepo.findByProduct(product)
                        .orElseThrow(() -> new RuntimeException("Stock not found"));;
                if (stock == null) {
                    stock = new ProductStock();
                    stock.setProduct(product);
                    stock.setQuantity(0);
                }
                stock.setQuantity(stock.getQuantity() + item.getQuantity());
                stockRepo.save(stock);

                // ২. সেলিং প্রাইস আপডেট (Selling Price = Purchase Price + 20%)
                BigDecimal purchasePrice = item.getUnitPrice();
                BigDecimal profit = purchasePrice.multiply(new BigDecimal("0.20"));
                BigDecimal newSellingPrice = purchasePrice.add(profit);

                product.setSellingPrice(newSellingPrice);
                productRepo.save(product);
            }
            ledgerService.createSupplierPurchaseEntry(order);
        }
        // CANCELED hole ekhane extra kono loop cholbe na, sudhu save hobe.
        return purchaseRepo.save(order);
    }

    @Override
    public List<PurchaseOrderHeader> getAllOrders() {
        return purchaseRepo.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Override
    public PurchaseOrderHeader getById(Long id) {
        return purchaseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public void delete(Long id) {
        purchaseRepo.deleteById(id);
    }

}
