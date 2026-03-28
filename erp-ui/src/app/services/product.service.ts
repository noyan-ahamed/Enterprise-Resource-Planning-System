import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../models/product";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ProductSerivce{
     private productSubject = new BehaviorSubject<Product[]>([]);



  private baseUrl = 'http://localhost:8080/product';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}`);
}

  addProduct(payload: Product){
    return this.http.post(`${this.baseUrl}/create-product`,payload)
  }

  updateProduct(id: number, data: Product) {
  return this.http.put(`${this.baseUrl}/update-supplier/${id}`, data);
}


  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/delete-supplier/${id}`);
  }
}