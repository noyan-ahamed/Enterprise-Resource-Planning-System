// export interface PurchaseOrderItem {
//   productId: number;
//   quantity: number;
//   price: number;
//   lineTotal?: number;
// }

import { Product } from "./product";
import { Supplier } from "./supplier.model";

// export interface PurchaseOrder {
//   id?: number;
//   invoiceNumber?: string;
//   supplier: any;
//   supplierId?: number;
//   paymentTerms?: string;
//   totalAmount?: number;
//   status?: 'PENDING' | 'APPROVED' | 'RECEIVED';
//   created_at?: string;
//   items: PurchaseOrderItem[];
// }

export type CreatePurchase = {
  supplierId: number;
  paymentTerms?: string;
  items: PurchaseItem[];
};




export interface PurchaseItem {
  productId: Product;
  product: Product;
  productName?: string; // UI তে দেখানোর জন্য
  unit?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id?: number;
  supplier: Supplier;
  invoiceNumber?: string;
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELED';
  paymentTerms: string;
  items: PurchaseItem[];
  totalAmount: number;
  created_at?: string;
}