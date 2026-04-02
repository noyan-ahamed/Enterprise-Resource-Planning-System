package com.erp.services;

import com.erp.enities.CustomerPayment;
import com.erp.enities.SalesOrderHeader;

public interface InvoiceDeliveryService {
    void generateInvoice(SalesOrderHeader salesOrder);
    void printInvoice(SalesOrderHeader salesOrder);
    void emailInvoice(String to, String subject, String body);

    void notifySellerPaymentApproved(CustomerPayment payment);
}
