package com.erp.services;

import com.erp.enities.Department;

import java.util.List;

public interface DepartmentService {
    List<Department> getAllDept();
    Department createDept(Department department);
}
