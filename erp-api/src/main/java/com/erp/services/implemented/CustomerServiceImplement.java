package com.erp.services.implemented;

import com.erp.dto.CustomerDTO;
import com.erp.enities.Customer;
import com.erp.repositories.CustomerRepository;
import com.erp.services.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImplement implements CustomerService {

    private final CustomerRepository customerRepo;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @Override
    @Transactional
    public Customer createCustomer(CustomerDTO dto) {
        Customer customer = new Customer();
        mapDtoToEntity(dto, customer);
        return customerRepo.save(customer);
    }

    @Override
    @Transactional
    public Customer updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        mapDtoToEntity(dto, customer);
        return customerRepo.save(customer);
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepo.deleteById(id);
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepo.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    private void mapDtoToEntity(CustomerDTO dto, Customer customer) {
        customer.setName(dto.getName());
        customer.setCompanyName(dto.getCompanyName());
        customer.setMobileNumber(dto.getMobileNumber());
        customer.setAddress(dto.getAddress());
    }
}
