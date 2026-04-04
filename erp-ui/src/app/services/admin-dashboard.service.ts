import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboardResponse } from '../models/admin-dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/admin-dashboard';

  constructor() {}

  getDashboardData(
    filterType: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminDashboardResponse> {
    let params = new HttpParams().set('filterType', filterType);

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<AdminDashboardResponse>(this.baseUrl, { params });
  }
}
