package com.erp.services.implemented;

import com.erp.enities.CustomerPayment;
import com.erp.enities.SalesOrderHeader;
import com.erp.services.InvoiceDeliveryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class InvoiceDeliveryServiceImplement implements InvoiceDeliveryService {

    @Override
    public void generateInvoice(SalesOrderHeader salesOrder) {
        log.info("Invoice generation placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
    }

    @Override
    public void printInvoice(SalesOrderHeader salesOrder) {
        log.info("Invoice print placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
    }

    @Override
    public void emailInvoice(SalesOrderHeader salesOrder) {
        log.info("Invoice email placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
    }

    @Override
    public void notifySellerPaymentApproved(CustomerPayment payment) {
        log.info("Notify seller placeholder for approved payment: {}", payment.getVoucherNo());
    }
}
