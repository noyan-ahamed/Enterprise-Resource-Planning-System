import { inject, Injectable } from "@angular/core";
import { SupplierDetail, SupplierLedgerEntry, SupplierLedgerSummary, SupplierPayment, SupplierPaymentRequest } from "../models/supplier-ledger.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SuppliersService } from "./suppliers.service";

@Injectable({ providedIn: 'root' })
export class SupplierLedgerService{
    
  private baseUrl = 'http://localhost:8080/supplier-ledger';
  private paymentUrl = 'http://localhost:8080/supplier-payments'
  private supplierapi = inject(SuppliersService)

  constructor(private http: HttpClient) {}

  // ======================
  // Summary Page
  // ======================
  getSupplierLedgerSummary(): Observable<SupplierLedgerSummary[]> {
    return this.http.get<SupplierLedgerSummary[]>(
      `${this.baseUrl}/due-summary`
    );
  }

  // ======================
  // Supplier Details Page
  // ======================
  getSupplierLedgerById(supplierId: number): Observable<SupplierLedgerEntry[]> {
    return this.http.get<SupplierLedgerEntry[]>(
      `${this.baseUrl}/${supplierId}`
    );
  }

  getSupplierDueSummaryById(supplierId: number): Observable<SupplierLedgerSummary> {
    return this.http.get<SupplierLedgerSummary>(
      `${this.baseUrl}/due-summary/${supplierId}`
    );
  }

  // optional - যদি supplier master api থাকে
  getSupplierById(supplierId: number): Observable<SupplierDetail> {
    return this.supplierapi.getSupplierById(supplierId);
  }

  // ======================
  // Payment
  // ======================
  getSupplierPayments(supplierId: number): Observable<SupplierPayment[]> {
    return this.http.get<SupplierPayment[]>(
      `${this.paymentUrl}/supplier/${supplierId}`
    );
  }

  createSupplierPayment(payload: SupplierPaymentRequest): Observable<any> {
    return this.http.post(
      `${this.paymentUrl}`,
      payload
    );
  }
}