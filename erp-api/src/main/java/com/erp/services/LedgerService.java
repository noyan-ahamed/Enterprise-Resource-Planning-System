package com.erp.services;

import com.erp.enities.PartyLedgerEntry;
import com.erp.enities.PurchaseOrderHeader;
import com.erp.enities.SupplierPayment;

import java.util.List;

public interface LedgerService {

    void createSupplierPurchaseEntry(PurchaseOrderHeader order);

    void createSupplierPaymentEntry(SupplierPayment payment);

    List<PartyLedgerEntry> getAllLedger();
}
