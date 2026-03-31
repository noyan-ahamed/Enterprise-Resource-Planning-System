package com.erp.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CustomerDueSummaryDTO {
    private Long customerId;
    private String customerName;
    private String mobileNumber;
    private String companyName;
    private BigDecimal totalSales;
    private BigDecimal totalApprovedPayment;
    private BigDecimal currentDue;
}
