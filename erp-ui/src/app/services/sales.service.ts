import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CustomerSearchResponse,
  SalesCreateRequest,
  SalesResponse
} from '../models/sales.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/sales'; // তোমার backend অনুযায়ী change করো

  createSale(payload: SalesCreateRequest): Observable<SalesResponse> {
    return this.http.post<SalesResponse>(this.baseUrl, payload);
  }

  getAllSales(): Observable<SalesResponse[]> {
    return this.http.get<SalesResponse[]>(this.baseUrl);
  }

  getSaleById(id: number): Observable<SalesResponse> {
    return this.http.get<SalesResponse>(`${this.baseUrl}/${id}`);
  }

  searchCustomers(keyword: string): Observable<CustomerSearchResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<CustomerSearchResponse[]>(`${this.baseUrl}/customer-search`, { params });
  }
}
