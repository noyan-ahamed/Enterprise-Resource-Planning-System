package com.erp.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SupplierDueSummaryDTO {

    private Long supplierId;
    private String supplierName;
    private BigDecimal totalPurchase = BigDecimal.ZERO;
    private BigDecimal totalPayment = BigDecimal.ZERO;
    private BigDecimal currentDue = BigDecimal.ZERO;
}