export interface AdminDashboardSummary {
  todaySales: number;
  monthSales: number;
  todayProfit: number;
  monthProfit: number;
  totalCustomerDue: number;
  totalSupplierPayable: number;
  lowStockCount: number;
  totalProducts: number;
}

export interface AdminDashboardTrendPoint {
  label: string; // date or month
  sales: number;
  profit: number;
}

export interface AdminDashboardCategorySales {
  categoryName: string;
  totalSales: number;
}

export interface AdminDashboardPaymentMethod {
  paymentMethod: string;
  totalAmount: number;
}

export interface AdminDashboardLowStockItem {
  productId: number;
  productName: string;
  sku: string;
  stock: number;
  minStockLevel: number;
}

export interface AdminDashboardActivity {
  type: 'SALE' | 'PURCHASE' | 'CUSTOMER_PAYMENT' | 'SUPPLIER_PAYMENT' | string;
  title: string;
  referenceNo: string;
  amount: number;
  date: string;
}

export interface AdminDashboardTopCustomer {
  customerId: number;
  customerName: string;
  mobileNumber: string;
  totalPurchaseAmount: number;
}

export interface AdminDashboardTopProduct {
  productId: number;
  productName: string;
  sku: string;
  totalSoldQty: number;
  totalSoldAmount: number;
}

export interface AdminDashboardResponse {
  summary: AdminDashboardSummary;
  salesProfitTrend: AdminDashboardTrendPoint[];
  monthlySalesComparison: AdminDashboardTrendPoint[];
  paymentMethodDistribution: AdminDashboardPaymentMethod[];
  lowStockItems: AdminDashboardLowStockItem[];
  recentActivities: AdminDashboardActivity[];
  topCustomers: AdminDashboardTopCustomer[];
  topProducts: AdminDashboardTopProduct[];
}
