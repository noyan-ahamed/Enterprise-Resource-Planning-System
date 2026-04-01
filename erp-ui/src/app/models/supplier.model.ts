export interface Supplier {
  id: number;                       // entity এর id
  name: string;                     // entity এর name
  companyName?: string;             // entity এর companyName
  mobileNumber: string;             // entity এর mobileNumber
  tinNumber?: string;               // entity এর tinNumber
  address?: string;                 // entity এর address
  email?:string;
  paymentTerms?: string;            // entity এর paymentTerms
  status?: string;   // entity এর status
  rating?: string;                  // entity এর rating
  bankAccount?: string;             // entity এর bankAccount
  bkashNo?: string;                 // entity এর bkashNo
  createdAt?: Date;                 // entity এর created_at
}

/**
 * DTO for creating new supplier
 * ID is excluded because DB generates it
 */
export type CreateSupplier = Omit<Supplier, 'id'>;


/**
 * DTO for updating supplier
 * ID required here
 */
export type UpdateSupplier = Supplier;
