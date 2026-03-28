import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createCategory } from '../models/product-category.model';

@Injectable({
  providedIn: 'root',
})
export class ProdcutCategoryService {
  private bassurl = 'http://localhost:8080/category';
  private http = inject(HttpClient);

  getCategory(){
  return this.http.get<any[]>(`${this.bassurl}`);
}

  addCategory(payload: createCategory){
    return this.http.post(`${this.bassurl}/create-category`,payload);
  }

updateCategory(id: number, payload: createCategory){
  return this.http.put(`${this.bassurl}/${id}`, payload);
}

deleteCategory(id: number){
  return this.http.delete(`${this.bassurl}/${id}`);
}
}
