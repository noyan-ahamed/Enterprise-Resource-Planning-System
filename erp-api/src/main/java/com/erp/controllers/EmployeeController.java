package com.erp.controllers;

import com.erp.dto.EmployeeDTO;
import com.erp.enities.Employee;
import com.erp.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping({"", "/"})
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PostMapping("/create-employee")
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.createEmployee(dto));
    }

    @PutMapping("/update-employee/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    @DeleteMapping("/delete-employee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }
}
