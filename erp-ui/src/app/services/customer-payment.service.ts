import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CustomerDueSummary,
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

  constructor() {}

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
}
