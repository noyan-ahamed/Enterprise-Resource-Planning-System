package com.erp.services.implemented;

import com.erp.dto.CustomerPaymentApprovalRequestDTO;
import com.erp.dto.CustomerPaymentRequestDTO;
import com.erp.dto.CustomerPaymentResponseDTO;
import com.erp.enities.Customer;
import com.erp.enities.CustomerPayment;
import com.erp.enities.Employee;
import com.erp.enities.SalesOrderHeader;
import com.erp.enities.Users;
import com.erp.enums.CustomerPaymentStatus;
import com.erp.repositories.*;
import com.erp.services.CustomerPaymentService;
import com.erp.services.InvoiceDeliveryService;
import com.erp.services.LedgerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerPaymentServiceImplement implements CustomerPaymentService {

    private final CustomerPaymentRepository customerPaymentRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderHeaderRepository salesOrderHeaderRepository;
    private final EmployeeRepository employeeRepository;
    private final UsersRepository usersRepository;
    private final LedgerService ledgerService;
    private final InvoiceNumberServiceImplement invoiceNumberService;
    private final InvoiceDeliveryService invoiceDeliveryService;

    @Override
    @Transactional
    public CustomerPaymentResponseDTO createPayment(CustomerPaymentRequestDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        SalesOrderHeader salesOrder = null;
        if (request.getSalesOrderId() != null) {
            salesOrder = salesOrderHeaderRepository.findById(request.getSalesOrderId())
                    .orElseThrow(() -> new RuntimeException("Sales order not found."));
        }

        Employee receiver = null;
        if (request.getReceivedByEmployeeId() != null) {
            receiver = employeeRepository.findById(request.getReceivedByEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found."));
        }

        if (request.getAmount() == null || request.getAmount().signum() <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero.");
        }

        CustomerPayment payment = new CustomerPayment();
        payment.setVoucherNo(invoiceNumberService.generate("RCV"));
        payment.setCustomer(customer);
        payment.setSalesOrder(salesOrder);
        payment.setReceivedByEmployee(receiver);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setRemarks(request.getRemarks());
        payment.setStatus(CustomerPaymentStatus.PENDING_APPROVAL);

        CustomerPayment saved = customerPaymentRepository.save(payment);
        return map(saved);
    }

    @Override
    @Transactional
    public CustomerPaymentResponseDTO approvePayment(Long paymentId, CustomerPaymentApprovalRequestDTO request) {
        CustomerPayment payment = customerPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found."));

        if (payment.getStatus() == CustomerPaymentStatus.APPROVED) {
            throw new RuntimeException("Payment already approved.");
        }

        Users approver = null;
        if (request.getApprovedByUserId() != null) {
            approver = usersRepository.findById(request.getApprovedByUserId())
                    .orElseThrow(() -> new RuntimeException("Approver user not found."));
        }

        payment.setStatus(CustomerPaymentStatus.APPROVED);
        payment.setApprovedBy(approver);
        payment.setApprovedDate(java.time.LocalDate.now());

        CustomerPayment saved = customerPaymentRepository.save(payment);

        // FINAL ledger impact only after approval
        ledgerService.createCustomerPaymentEntry(saved);

        invoiceDeliveryService.notifySellerPaymentApproved(saved);

        return map(saved);
    }

    @Override
    @Transactional
    public CustomerPaymentResponseDTO rejectPayment(Long paymentId, CustomerPaymentApprovalRequestDTO request) {
        CustomerPayment payment = customerPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found."));

        if (payment.getStatus() == CustomerPaymentStatus.APPROVED) {
            throw new RuntimeException("Approved payment cannot be rejected.");
        }

        payment.setStatus(CustomerPaymentStatus.REJECTED);
        CustomerPayment saved = customerPaymentRepository.save(payment);
        return map(saved);
    }

    @Override
    public List<CustomerPaymentResponseDTO> getPaymentsByCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found."));
        return customerPaymentRepository.findByCustomer(customer).stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<CustomerPaymentResponseDTO> getPendingPayments() {
        return customerPaymentRepository.findByStatus(CustomerPaymentStatus.PENDING_APPROVAL).stream()
                .map(this::map)
                .toList();
    }

    private CustomerPaymentResponseDTO map(CustomerPayment payment) {
        CustomerPaymentResponseDTO dto = new CustomerPaymentResponseDTO();
        dto.setId(payment.getId());
        dto.setVoucherNo(payment.getVoucherNo());
        dto.setCustomerId(payment.getCustomer().getId());
        dto.setCustomerName(payment.getCustomer().getName());
        dto.setCustomerMobile(payment.getCustomer().getMobileNumber());
        dto.setSalesInvoiceNumber(payment.getSalesOrder() != null ? payment.getSalesOrder().getInvoiceNumber() : null);
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setRemarks(payment.getRemarks());
        dto.setStatus(payment.getStatus());
        return dto;
    }
}
