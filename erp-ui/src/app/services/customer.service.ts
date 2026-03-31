import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Customer } from "../models/customer.model";
import { Observable } from "rxjs";
import { QuickCustomerCreateRequest } from "../models/sales.model";

@Injectable({providedIn:'root',})
export class CustomerService{
     private baseUrl = 'http://localhost:8080/customer';
  private http = inject(HttpClient);

  getCustomer(): Observable<Customer[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }


   getCustomerById(customerId: number): Observable<Customer> {
      return this.http.get<Customer>(
        `${this.baseUrl}/${customerId}`
      );
    }

  addCustomer(payload: Customer){
    return this.http.post(`${this.baseUrl}/create-customer`,payload)
  }

  updateCustomer(id: number, data: Customer) {
  return this.http.put(`${this.baseUrl}/update-customer/${id}`, data);
}


  deleteCustomer(id: number) {
    return this.http.delete(`${this.baseUrl}/delete-supplier/${id}`);
  }

  quickCustomerCreate(payload: QuickCustomerCreateRequest){
    return this.http.post(`${this.baseUrl}/quick-create`, payload)
  }
}