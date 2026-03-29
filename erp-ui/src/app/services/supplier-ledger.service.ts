import { Injectable } from "@angular/core";
import { SupplierDetail, SupplierLedgerEntry, SupplierLedgerSummary, SupplierPayment, SupplierPaymentRequest } from "../models/supplier-ledger.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class SupplierLedgerService{
    
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ======================
  // Summary Page
  // ======================
  getSupplierLedgerSummary(): Observable<SupplierLedgerSummary[]> {
    return this.http.get<SupplierLedgerSummary[]>(
      `${this.baseUrl}/supplier-ledger/due-summary`
    );
  }

  // ======================
  // Supplier Details Page
  // ======================
  getSupplierLedgerById(supplierId: number): Observable<SupplierLedgerEntry[]> {
    return this.http.get<SupplierLedgerEntry[]>(
      `${this.baseUrl}/supplier-ledger/${supplierId}`
    );
  }

  getSupplierDueSummaryById(supplierId: number): Observable<SupplierLedgerSummary> {
    return this.http.get<SupplierLedgerSummary>(
      `${this.baseUrl}/supplier-ledger/due-summary/${supplierId}`
    );
  }

  // optional - যদি supplier master api থাকে
  getSupplierById(supplierId: number): Observable<SupplierDetail> {
    return this.http.get<SupplierDetail>(
      `${this.baseUrl}/suppliers/${supplierId}`
    );
  }

  // ======================
  // Payment
  // ======================
  getSupplierPayments(supplierId: number): Observable<SupplierPayment[]> {
    return this.http.get<SupplierPayment[]>(
      `${this.baseUrl}/supplier-payments/supplier/${supplierId}`
    );
  }

  createSupplierPayment(payload: SupplierPaymentRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/supplier-payments`,
      payload
    );
  }
}