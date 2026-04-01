import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CustomerDueSummary,
  CustomerPaymentApprovalRequest,
  CustomerPaymentCreateRequest,
  CustomerPaymentResponse
} from '../models/customer-due-collection.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/customer-payments';

  // =========================
  // Employee Due Collection
  // =========================
  getCustomerDueSummary(keyword: string): Observable<CustomerDueSummary> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<CustomerDueSummary>(`${this.baseUrl}/summary`, { params });
  }

  createCustomerPayment(payload: CustomerPaymentCreateRequest): Observable<CustomerPaymentResponse> {
    return this.http.post<CustomerPaymentResponse>(this.baseUrl, payload);
  }

  getPaymentsByCustomer(customerId: number): Observable<CustomerPaymentResponse[]> {
    return this.http.get<CustomerPaymentResponse[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  // ============= Admin Ready =============
   getPendingPayments(): Observable<CustomerPaymentResponse[]> {
    return this.http.get<CustomerPaymentResponse[]>(`${this.baseUrl}/pending`);
  }

  // approvePayment(paymentId: number, approvedByUserId: number, ): Observable<CustomerPaymentResponse> {
  //   return this.http.put<CustomerPaymentResponse>(
  //     `${this.baseUrl}/${paymentId}/approve`,
  //     { approvedByUserId }
  //   );
  // }
   approvePayment(paymentId: number, payload: CustomerPaymentApprovalRequest): Observable<CustomerPaymentResponse> {
    return this.http.put<CustomerPaymentResponse>(`${this.baseUrl}/${paymentId}/approve`, payload);
  }

  // rejectPayment(paymentId: number, approvedByUserId: number): Observable<CustomerPaymentResponse> {
  //   return this.http.put<CustomerPaymentResponse>(
  //     `${this.baseUrl}/${paymentId}/reject`,
  //     { approvedByUserId }
  //   );
  // }
   rejectPayment(paymentId: number, payload: CustomerPaymentApprovalRequest): Observable<CustomerPaymentResponse> {
    return this.http.put<CustomerPaymentResponse>(`${this.baseUrl}/${paymentId}/reject`, payload);
  }







  // =========================
  // Admin Approval
  // =========================
  getAdminPaymentList(keyword: string = '', status: string = 'ALL'): Observable<CustomerPaymentResponse[]> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('status', status);

    return this.http.get<CustomerPaymentResponse[]>(`${this.baseUrl}/admin/list`, { params });
  }


}
