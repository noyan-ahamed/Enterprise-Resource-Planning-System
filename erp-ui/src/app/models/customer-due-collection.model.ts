export interface CustomerDueSummary {
  customerId: number;
  customerName: string;
  companyName?: string;
  mobileNumber: string;
  address?: string;

  totalSales: number;
  totalApprovedPayment: number;
  currentDue: number;

  lastPaymentDate?: string | null;
  lastSaleDate?: string | null;
}

export interface CustomerPaymentCreateRequest {
  customerId: number;
  salesOrderId?: number | null; // optional, later if specific invoice wise payment লাগে
  receivedByEmployeeId?: number | null;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  remarks?: string;
}

export interface CustomerPaymentResponse {
  id: number;
  voucherNo: string;
  customerId: number;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  remarks?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  receivedByEmployeeId?: number;
  receivedByEmployeeName?: string;
  salesOrderId?: number | null;
}

export interface CustomerPaymentHistoryRow {
  id: number;
  voucherNo: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  remarks?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
}
