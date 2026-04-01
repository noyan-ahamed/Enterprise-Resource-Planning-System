export interface CustomerSearchResponse {
  id: number;
  name: string;
  email: string;
  companyName?: string;
  mobileNumber: string;
  address?: string;
}

export interface QuickCustomerCreateRequest {
  name: string;
  email:string;
  companyName?: string;
  mobileNumber: string;
  address?: string;
}

export interface SalesItemRequest {
  productId: number;
  quantity: number;
  unitPrice?: number; // backend এখন ignore করবে ideally
}

export interface SalesCreateRequest {
  customerId?: number | null;
  sellerEmployeeId?: number | null;
  salesDate: string;
  discountAmount: number;
  paidAmount: number;
  remarks?: string;
  newCustomer?: QuickCustomerCreateRequest | null;
  items: SalesItemRequest[];
}

export interface SalesOrderItemResponse {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SalesResponse {
  salesId: number;
  invoiceNumber: string;
  salesDate: string;
  customerId: number;
  customerName: string;
  customerMobile: string;
  sellerEmployeeId?: number;
  sellerEmployeeName?: string;
  subTotal: number;
  discountAmount: number;
  netTotal: number;
  paidAmount: number;
  dueAmount: number;
  remarks?: string;
  items: SalesOrderItemResponse[];
}
