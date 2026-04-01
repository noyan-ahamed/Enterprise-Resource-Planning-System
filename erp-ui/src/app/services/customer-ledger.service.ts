import { inject, Injectable } from "@angular/core";
import { CustomerService } from "./customer.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CustomerLedgerEntry, CustomerLedgerSummary } from "../models/customer-ledger.model";
import { Customer } from "../models/customer.model";

@Injectable({ providedIn: 'root' })
export class CustomerLedgerService{
      
  private baseUrl = 'http://localhost:8080/customer-ledger';
//   private paymentUrl = 'http://localhost:8080/supplier-payments'
  private customerapi = inject(CustomerService)

  constructor(private http: HttpClient) {}

  // ======================
  // Summary Page
  // ======================
  getCustomerLedgerSummary(): Observable<CustomerLedgerSummary[]> {
    return this.http.get<CustomerLedgerSummary[]>(
      `${this.baseUrl}/due-summary`
    );
  }

  // ======================
  // Customer Details Page
  // ======================
  getCustomerLedgerById(customerId: number): Observable<CustomerLedgerEntry[]> {
    return this.http.get<CustomerLedgerEntry[]>(
      `${this.baseUrl}/${customerId}`
    );
  }

  getCustomerDueSummaryById(customerId: number): Observable<CustomerLedgerSummary> {
    return this.http.get<CustomerLedgerSummary>(
      `${this.baseUrl}/due-summary/${customerId}`
    );
  }

  // optional - যদি customer master api থাকে
  getCustomerById(customerId: number): Observable<Customer> {
    return this.customerapi.getCustomerById(customerId);
  }

  // ======================
  // Payment
  // ======================
//   getSupplierPayments(supplierId: number): Observable<SupplierPayment[]> {
//     return this.http.get<SupplierPayment[]>(
//       `${this.paymentUrl}/supplier/${supplierId}`
//     );
//   }

//   createSupplierPayment(payload: SupplierPaymentRequest): Observable<any> {
//     return this.http.post(
//       `${this.paymentUrl}`,
//       payload
//     );
//   }

}