package com.erp.controllers.admin_dashboard;

import com.erp.dto.admin_dashboard.DashboardResponseDTO;
import com.erp.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/admin-dashboard")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponseDTO getDashboard(
            @RequestParam(defaultValue = "MONTH") String filterType,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate
    ) {
        return dashboardService.getDashboardData(filterType, fromDate, toDate);
    }
}