export interface ProductCategoryModel {
    id: number;
    name: string;
    description: string;
    status: string;
    products?: any[];
    productCount?: number;
}

/**
 * DTO for creating new supplier
 * ID is excluded because DB generates it
 */
export type createCategory = Omit<ProductCategoryModel, 'id'>;