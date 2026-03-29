export interface SupplierLedgerSummary {
  supplierId: number;
  supplierName: string;
  totalPurchase: number;
  totalPayment: number;
  currentDue: number;

  // optional - supplier table থেকে পরে merge করতে পারো
  companyName?: string;
  mobileNumber?: string;
}

export interface SupplierLedgerEntry {
  date: string | null;
  transactionType: 'PURCHASE' | 'PAYMENT' | 'PURCHASE_RETURN' | string;
  referenceType: string;
  referenceId: number;
  referenceNo: string;
  debit: number;
  credit: number;
  runningBalance: number;
  remarks: string;
}

export interface SupplierPayment {
  id: number;
  voucherNo: string;
  supplierName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK' | 'BKASH' | 'NAGAD';
  remarks: string;
  purchaseInvoiceNumber?: string;
}

export interface SupplierPaymentRequest {
  supplierId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK' | 'BKASH' | 'NAGAD';
  remarks: string;
  purchaseOrderId?: number | null;
}

export interface SupplierDetail {
  id: number;
  name: string;
  companyName?: string;
  mobileNumber?: string;
  address?: string;
  paymentTerms?: string;
}
