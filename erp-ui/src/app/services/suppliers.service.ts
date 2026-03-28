import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateSupplier, Supplier, UpdateSupplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);



  private baseUrl = 'http://localhost:8080/supplier';
  private http = inject(HttpClient);

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }


  // generateSupplierCode(): string {
  //   const count = this.suppliersSubject.value.length + 1;
  //   return `SUP-${count.toString().padStart(4, '0')}`;
  // }


  addSupplier(payload: CreateSupplier){
    return this.http.post(`${this.baseUrl}/create-supplier`,payload)
  }

  updateSupplier(id: number, data: UpdateSupplier) {
  return this.http.put(`${this.baseUrl}/update-supplier/${id}`, data);
}


  deleteSupplier(id: number) {
    return this.http.delete(`${this.baseUrl}/delete-supplier/${id}`);
  }
}