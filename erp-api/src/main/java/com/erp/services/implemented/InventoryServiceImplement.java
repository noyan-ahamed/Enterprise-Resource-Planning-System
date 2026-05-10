package com.erp.services.implemented;

import com.erp.enities.InventoryBatch;
import com.erp.enities.Product;
import com.erp.enities.ProductStock;
import com.erp.repositories.InventoryBatchRepository;
import com.erp.repositories.ProductStockRepository;
import com.erp.services.InventoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImplement
        implements InventoryService {

    private final InventoryBatchRepository batchRepo;

    private final ProductStockRepository stockRepo;

    @Override
    @Transactional
    public void consumeStock(Product product, Integer sellQty) {

        List<InventoryBatch> batches =
                batchRepo
                        .findByProductAndRemainingQuantityGreaterThanOrderByReceivedDateAscIdAsc(
                                product,
                                0
                        );

        int remaining = sellQty;

        for (InventoryBatch batch : batches) {

            if (remaining <= 0) {
                break;
            }

            int available = batch.getRemainingQuantity();

            // enough qty in batch
            if (available >= remaining) {

                batch.setRemainingQuantity(
                        available - remaining
                );

                remaining = 0;

            } else {

                // consume full batch
                batch.setRemainingQuantity(0);

                remaining = remaining - available;
            }

            batchRepo.save(batch);
        }

        // stock shortage
        if (remaining > 0) {
            throw new RuntimeException(
                    "Insufficient stock for product: "
                            + product.getName()
            );
        }

        // total stock reduce
        ProductStock stock =
                stockRepo.findByProduct(product)
                        .orElseThrow(() ->
                                new RuntimeException("Stock not found")
                        );

        stock.setQuantity(
                stock.getQuantity() - sellQty
        );

        stockRepo.save(stock);
    }
}