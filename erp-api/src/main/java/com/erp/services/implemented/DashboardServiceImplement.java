package com.erp.services.implemented;

import com.erp.dto.admin_dashboard.*;
import com.erp.repositories.*;
import com.erp.services.CustomerLedgerService;
import com.erp.services.DashboardService;
import com.erp.services.SupplierLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImplement implements DashboardService {

    private final SalesOrderHeaderRepository salesOrderHeaderRepository;
    private final CustomerPaymentRepository customerPaymentRepository;
    private final SupplierPaymentRepository supplierPaymentRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderHeaderRepository purchaseOrderHeaderRepository;
     private final CustomerLedgerService customerLedgerService;
     private final SupplierLedgerService supplierLedgerService;

    @Override
    public DashboardResponseDTO getDashboardData(String filterType, LocalDate fromDate, LocalDate toDate) {

        LocalDate today = LocalDate.now();

        // ---------- Resolve Date Range ----------
        LocalDate startDate;
        LocalDate endDate;

        switch (filterType.toUpperCase()) {
            case "TODAY" -> {
                startDate = today;
                endDate = today;
            }
            case "WEEK" -> {
                startDate = today.minusDays(6);
                endDate = today;
            }
            case "YEAR" -> {
                startDate = today.withDayOfYear(1);
                endDate = today;
            }
            case "CUSTOM" -> {
                startDate = fromDate != null ? fromDate : today.minusDays(29);
                endDate = toDate != null ? toDate : today;
            }
            default -> {
                startDate = today.minusDays(29);
                endDate = today;
            }
        }

        DashboardResponseDTO response = new DashboardResponseDTO();

        response.setSummary(buildSummary(today, startDate, endDate));
        response.setSalesProfitTrend(buildSalesProfitTrend(startDate, endDate));
        response.setMonthlySalesComparison(buildMonthlySalesComparison());
        response.setPaymentMethodDistribution(buildPaymentMethodDistribution(startDate, endDate));
        response.setLowStockItems(buildLowStockItems());
        response.setRecentActivities(buildRecentActivities());
        response.setTopCustomers(buildTopCustomers(startDate, endDate));
        response.setTopProducts(buildTopProducts(startDate, endDate));

        return response;
    }

    private DashboardSummaryDTO buildSummary(LocalDate today, LocalDate startDate, LocalDate endDate) {
        DashboardSummaryDTO dto = new DashboardSummaryDTO();

        // TODO: replace with real queries
        dto.setTodaySales(BigDecimal.ZERO);
        dto.setMonthSales(BigDecimal.ZERO);
        dto.setTodayProfit(BigDecimal.ZERO);
        dto.setMonthProfit(BigDecimal.ZERO);
        dto.setTotalCustomerDue(BigDecimal.ZERO);
        dto.setTotalSupplierPayable(BigDecimal.ZERO);
        dto.setLowStockCount(0L);
        dto.setTotalProducts(0L);

        return dto;
    }

    private List<DashboardTrendPointDTO> buildSalesProfitTrend(LocalDate startDate, LocalDate endDate) {
        List<DashboardTrendPointDTO> list = new ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            DashboardTrendPointDTO dto = new DashboardTrendPointDTO();
            dto.setLabel(current.toString());

            // TODO: replace with actual sales/profit by date
            dto.setSales(BigDecimal.ZERO);
            dto.setProfit(BigDecimal.ZERO);

            list.add(dto);
            current = current.plusDays(1);
        }

        return list;
    }

    private List<DashboardTrendPointDTO> buildMonthlySalesComparison() {
        List<DashboardTrendPointDTO> list = new ArrayList<>();

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        for (String month : months) {
            DashboardTrendPointDTO dto = new DashboardTrendPointDTO();
            dto.setLabel(month);

            // TODO: replace with actual month-wise sales
            dto.setSales(BigDecimal.ZERO);
            dto.setProfit(BigDecimal.ZERO);

            list.add(dto);
        }

        return list;
    }

    private List<DashboardPaymentMethodDTO> buildPaymentMethodDistribution(LocalDate startDate, LocalDate endDate) {
        List<DashboardPaymentMethodDTO> list = new ArrayList<>();

        // TODO: replace with grouped customer payment method totals
        DashboardPaymentMethodDTO cash = new DashboardPaymentMethodDTO();
        cash.setPaymentMethod("CASH");
        cash.setTotalAmount(BigDecimal.ZERO);

        DashboardPaymentMethodDTO bank = new DashboardPaymentMethodDTO();
        bank.setPaymentMethod("BANK");
        bank.setTotalAmount(BigDecimal.ZERO);

        DashboardPaymentMethodDTO mobile = new DashboardPaymentMethodDTO();
        mobile.setPaymentMethod("MOBILE_BANKING");
        mobile.setTotalAmount(BigDecimal.ZERO);

        list.add(cash);
        list.add(bank);
        list.add(mobile);

        return list;
    }

    private List<DashboardLowStockItemDTO> buildLowStockItems() {
        List<DashboardLowStockItemDTO> list = new ArrayList<>();

        // TODO: productRepo query where stock <= minStockLevel
        return list;
    }

    private List<DashboardActivityDTO> buildRecentActivities() {
        List<DashboardActivityDTO> list = new ArrayList<>();

        // TODO:
        // Merge latest:
        // Sales
        // Purchases
        // Customer Payments
        // Supplier Payments

        return list;
    }

    private List<DashboardTopCustomerDTO> buildTopCustomers(LocalDate startDate, LocalDate endDate) {
        List<DashboardTopCustomerDTO> list = new ArrayList<>();

        // TODO: aggregate customer sales by date range
        return list;
    }

    private List<DashboardTopProductDTO> buildTopProducts(LocalDate startDate, LocalDate endDate) {
        List<DashboardTopProductDTO> list = new ArrayList<>();

        // TODO: aggregate sold items by product in date range
        return list;
    }
}