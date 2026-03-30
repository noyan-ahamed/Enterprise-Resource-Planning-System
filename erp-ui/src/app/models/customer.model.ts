
export interface Customer {
  id: number;                       // entity এর id
  name: string;                     // entity এর name
  companyName?: string;             // entity এর companyName
  mobileNumber: string;             // entity এর mobileNumber
  address?: string;                 // entity এর address
  createdAt?: Date;                 // entity এর created_at
  updatedAt?: Date;
}
