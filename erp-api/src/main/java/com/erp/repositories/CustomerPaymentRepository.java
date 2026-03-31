package com.erp.repositories;

import com.erp.enities.Customer;
import com.erp.enities.CustomerPayment;
import com.erp.enums.CustomerPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Long> {
    List<CustomerPayment> findByCustomer(Customer customer);
    List<CustomerPayment> findByStatus(CustomerPaymentStatus status);
    List<CustomerPayment> findByCustomerAndStatus(Customer customer, CustomerPaymentStatus status);
}
