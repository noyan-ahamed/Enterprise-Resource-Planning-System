import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreatePurchase, PurchaseOrder } from "../models/purchase-order";


@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/purchases';
  private reportUrl = 'http://localhost:8080/reports';

  getAll() {
    return this.http.get<PurchaseOrder[]>(this.baseUrl);
  }

  getById(id:any){
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/${id}`)
  }

  create(data: CreatePurchase) {
    return this.http.post(this.baseUrl, data);
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getReport(id: number){
  return this.http.get(`${this.reportUrl}/purchase-report?orderId=${id}`, {
    responseType: 'blob'
  });
}

sendMail(id: number){
  return this.http.post(`${this.baseUrl}/${id}/send-email`, {}, { responseType: 'text' });
}
}