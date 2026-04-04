import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { AdminDashboardService } from '../../../services/admin-dashboard.service';
import { AdminDashboardActivity, AdminDashboardLowStockItem, AdminDashboardPaymentMethod, AdminDashboardResponse, AdminDashboardSummary, AdminDashboardTopCustomer, AdminDashboardTopProduct, AdminDashboardTrendPoint } from '../../../models/admin-dashboard.model';


Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  private dashboardService = inject(AdminDashboardService);

  @ViewChild('salesProfitChartCanvas') salesProfitChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlySalesChartCanvas') monthlySalesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentMethodChartCanvas') paymentMethodChartCanvas!: ElementRef<HTMLCanvasElement>;

  loading = signal(false);

  filterForm = signal({
    filterType: 'MONTH',
    fromDate: '',
    toDate: ''
  });

  summary = signal<AdminDashboardSummary>({
    todaySales: 0,
    monthSales: 0,
    todayProfit: 0,
    monthProfit: 0,
    totalCustomerDue: 0,
    totalSupplierPayable: 0,
    lowStockCount: 0,
    totalProducts: 0
  });

  salesProfitTrend = signal<AdminDashboardTrendPoint[]>([]);
  monthlySalesComparison = signal<AdminDashboardTrendPoint[]>([]);
  paymentMethodDistribution = signal<AdminDashboardPaymentMethod[]>([]);
  lowStockItems = signal<AdminDashboardLowStockItem[]>([]);
  recentActivities = signal<AdminDashboardActivity[]>([]);
  topCustomers = signal<AdminDashboardTopCustomer[]>([]);
  topProducts = signal<AdminDashboardTopProduct[]>([]);

  private salesProfitChart: Chart | null = null;
  private monthlySalesChart: Chart | null = null;
  private paymentMethodChart: Chart | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    // initial render after view ready
    setTimeout(() => {
      this.renderCharts();
    }, 300);
  }

  updateFilter(field: string, value: any) {
    this.filterForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  loadDashboard() {
    const filter = this.filterForm();

    this.loading.set(true);

    this.dashboardService.getDashboardData(
      filter.filterType,
      filter.fromDate || undefined,
      filter.toDate || undefined
    ).subscribe({
      next: (res: AdminDashboardResponse) => {
        this.loading.set(false);

        this.summary.set(res.summary);
        this.salesProfitTrend.set(res.salesProfitTrend ?? []);
        this.monthlySalesComparison.set(res.monthlySalesComparison ?? []);
        this.paymentMethodDistribution.set(res.paymentMethodDistribution ?? []);
        this.lowStockItems.set(res.lowStockItems ?? []);
        this.recentActivities.set(res.recentActivities ?? []);
        this.topCustomers.set(res.topCustomers ?? []);
        this.topProducts.set(res.topProducts ?? []);

        setTimeout(() => {
          this.renderCharts();
        }, 100);
      },
      error: (err) => {
        this.loading.set(false);
        Swal.fire('Error', err?.error?.message || 'Failed to load dashboard data', 'error');
      }
    });
  }

  applyFilter() {
    const filter = this.filterForm();

    if (filter.filterType === 'CUSTOM') {
      if (!filter.fromDate || !filter.toDate) {
        Swal.fire('Warning', 'Select both from date and to date', 'warning');
        return;
      }
    }

    this.loadDashboard();
  }

  resetFilter() {
    this.filterForm.set({
      filterType: 'MONTH',
      fromDate: '',
      toDate: ''
    });

    this.loadDashboard();
  }

  renderCharts() {
    this.renderSalesProfitChart();
    this.renderMonthlySalesChart();
    this.renderPaymentMethodChart();
  }

  renderSalesProfitChart() {
    if (!this.salesProfitChartCanvas) return;

    if (this.salesProfitChart) {
      this.salesProfitChart.destroy();
    }

    const labels = this.salesProfitTrend().map(x => x.label);
    const sales = this.salesProfitTrend().map(x => Number(x.sales || 0));
    const profit = this.salesProfitTrend().map(x => Number(x.profit || 0));

    this.salesProfitChart = new Chart(this.salesProfitChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: sales,
            tension: 0.35,
            fill: true
          },
          {
            label: 'Profit',
            data: profit,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderMonthlySalesChart() {
    if (!this.monthlySalesChartCanvas) return;

    if (this.monthlySalesChart) {
      this.monthlySalesChart.destroy();
    }

    const labels = this.monthlySalesComparison().map(x => x.label);
    const sales = this.monthlySalesComparison().map(x => Number(x.sales || 0));

    this.monthlySalesChart = new Chart(this.monthlySalesChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: sales
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderPaymentMethodChart() {
    if (!this.paymentMethodChartCanvas) return;

    if (this.paymentMethodChart) {
      this.paymentMethodChart.destroy();
    }

    const labels = this.paymentMethodDistribution().map(x => x.paymentMethod);
    const values = this.paymentMethodDistribution().map(x => Number(x.totalAmount || 0));

    this.paymentMethodChart = new Chart(this.paymentMethodChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  formatCurrency(value: number | null | undefined): string {
    return `৳ ${Number(value || 0).toLocaleString()}`;
  }

  getActivityBadgeClass(type: string): string {
    switch (type) {
      case 'SALE':
        return 'bg-primary';
      case 'PURCHASE':
        return 'bg-warning text-dark';
      case 'CUSTOMER_PAYMENT':
        return 'bg-success';
      case 'SUPPLIER_PAYMENT':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
