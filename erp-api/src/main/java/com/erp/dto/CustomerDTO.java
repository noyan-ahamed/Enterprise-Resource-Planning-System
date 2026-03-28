package com.erp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerDTO {
    private String name;
    private String companyName;
    private String contactPerson;
    private String mobileNumber;
    private String tinNumber;
    private String address;
    private String paymentTerms;
    private Double creditLimit;
}
