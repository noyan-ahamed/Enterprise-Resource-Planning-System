package com.erp.services.implemented;

import com.erp.dto.EmployeeDTO;
import com.erp.enities.Department;
import com.erp.enities.Designation;
import com.erp.enities.Employee;
import com.erp.repositories.EmployeeRepository;
import com.erp.services.EmployeeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImplement implements EmployeeService {

    private final EmployeeRepository employeeRepo;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }

    @Override
    @Transactional
    public Employee createEmployee(EmployeeDTO dto) {

        // Optional: prevent duplicate email
//        if (employeeRepo.existsByEmail(dto.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }

        Employee employee = new Employee();
        mapDtoToEntity(dto, employee);

        return employeeRepo.save(employee);
    }

    @Override
    @Transactional
    public Employee updateEmployee(Long id, EmployeeDTO dto) {

        Employee employee = employeeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        mapDtoToEntity(dto, employee);

        return employeeRepo.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepo.deleteById(id);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // =========================
    // DTO → ENTITY MAPPING
    // =========================

    private void mapDtoToEntity(EmployeeDTO dto, Employee employee) {

        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setMobileNumber(dto.getMobileNumber());
        employee.setDesignation(dto.getDesignation());
        employee.setDepartment(dto.getDepartment());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setBasicSalary(dto.getBasicSalary());
        employee.setBankAccount(dto.getBankAccount());
    }
}
