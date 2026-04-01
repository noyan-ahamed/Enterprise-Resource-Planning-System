package com.erp.enities;

import com.erp.enums.SupplierStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "emails", unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String mobileNumber;
    @Column(name = "tin_number")
    private String tinNumber;
    private String address;
    @Column(name = "payment_terms")
    private String paymentTerms;

    @Enumerated(EnumType.STRING)
    private SupplierStatus status;
    private String rating;
    @Column(name = "bank_account")
    private String bankAccount;
    private String bkashNo;
    @Column(name = "created_at")
    private LocalDate createdAt;

    //getters Setters


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getTinNumber() {
        return tinNumber;
    }

    public void setTinNumber(String tinNumber) {
        this.tinNumber = tinNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public SupplierStatus getStatus() {
        return status;
    }

    public void setStatus(SupplierStatus status) {
        this.status = status;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public String getBkashNo() {
        return bkashNo;
    }

    public void setBkashNo(String bkashNo) {
        this.bkashNo = bkashNo;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
