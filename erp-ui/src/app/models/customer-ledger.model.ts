export interface CustomerLedgerSummary {
  customerId: number;
  customerName: string;
  totalSales: number;
  totalApprovedPayment: number;
  currentDue: number;

  // optional - supplier table থেকে পরে merge করতে পারো
  companyName?: string;
  mobileNumber?: string;
}


export interface CustomerLedgerEntry {
  date: string | null;
  transactionType: 'SALE' | 'PAYMENT' | 'SALES_RETURN' | string;
  referenceType: string;
  referenceId: number;
  referenceNo: string;
  debit: number;
  credit: number;
  runningBalance: number;
  remarks: string;
}