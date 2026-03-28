import { ProductCategoryModel } from "./product-category.model";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategoryModel;
  unit: string; // e.g., Pcs, Kg, Dozen
  sellingPrice: number;
  stock?: number;
  minStockLevel: number; // For low stock alerts
status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}