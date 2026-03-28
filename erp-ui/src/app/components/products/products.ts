import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';


// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

import Swal from 'sweetalert2';
import { Product } from '../../models/product';
import { ProdcutCategoryService } from '../../services/prodcut-category.service';
import { ProductSerivce } from '../../services/product.service';
import { ProductCategoryModel } from '../../models/product-category.model';
import { ProductCategory } from '../product-category/product-category';
@Component({
  selector: 'app-products',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, 
    MatTableModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatButtonModule, MatChipsModule, MatCardModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
// export class Products implements OnInit {
//  dataSource = new MatTableDataSource<Product>([]);
//   displayedColumns: string[] = ['sku', 'name', 'category', 'stock', 'price', 'status', 'actions'];
  
//   productForm: FormGroup;
//   showForm = false;
//   isEditing = false;

//   constructor(private fb: FormBuilder, 
//     private productCategoryService: ProdcutCategoryService, 
//     private productService: ProductSerivce) {
//     this.productForm = this.fb.group({
//       id: [''],
//   name: ['', Validators.required],
//   sku: ['', Validators.required],
//   category: [null, Validators.required], // 👈 object হবে
//   sellingPrice: [{ value: '', disabled: true }],
//   minStockLevel: [5],
//   status: ['ACTIVE']
//     });
//   }

//   ngOnInit() {
//     this.loadCategories();
//     this.loadProducts();
//   }
//   loadProducts() {
//   this.productService.getProducts().subscribe(data => {
//     this.dataSource.data = data;
//   });
// }
//   categories = signal<ProductCategoryModel[]>([]);

//   loadCategories(){
//     this.productCategoryService.getCategory().subscribe(res=>{
//       this.categories.set(res);
//     })
//   }

//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

//   saveProduct() {
//   if (this.productForm.invalid) return;

//   const productData = this.productForm.getRawValue();

//   const payload = {
//     ...productData,
//     created_at: new Date().toISOString().split('T')[0],
//     category: {
//       id: productData.category.id
//     }
//   };

//   this.productService.addProduct(payload).subscribe({
//     next: () => {
//       Swal.fire('Saved!', 'New product added to inventory.', 'success');
//       this.loadProducts();
//       this.resetForm();
//     },
//     error: () => {
//       Swal.fire('Error!', 'Product save failed!', 'error');
//     }
//   });
// }

//   editProduct(product: Product) {
//     this.isEditing = true;
//     this.showForm = true;
//     this.productForm.patchValue(product);
//   }

//   deleteProduct(id: string) {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "Stock records for this item will be removed!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // this.productService.deleteProduct(id);
//         Swal.fire('Deleted!', 'Product has been removed.', 'success');
//       }
//     });
//   }

//   resetForm() {
//     this.showForm = false;
//     this.isEditing = false;
//     this.productForm.reset({ status: 'Active', unit: 'Pcs' });
//   }
// }



export class Products implements OnInit {
  
  dataSource = signal<Product[]>([]);
  categories = signal<ProductCategoryModel[]>([]);

  productForm!: FormGroup;
  showForm = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: ProdcutCategoryService,
    private productService: ProductSerivce
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories(); // ✅ only this (important fix)
  }

  // ---------------- FORM ----------------
  initForm() {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      sku: ['', Validators.required],
      category: [ProductCategory, Validators.required],
      sellingPrice: [{value:'', disabled:true}], // ✅ FIX (was disabled আগে)
      minStockLevel: [5],
      status: ['ACTIVE']
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  resetForm() {
    this.productForm.reset({
      status: 'ACTIVE',
      minStockLevel: 5
    });
    this.showForm = false;
    this.isEditing = false;
  }

  // ---------------- LOAD ----------------

  loadCategories() {
    this.categoryService.getCategory().subscribe(res => {
      this.categories.set(res);
      this.loadProducts(); // ✅ FIX (after categories load)
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe(res => {
      this.dataSource.set(res);
    });
  }

  // ---------------- SAVE ----------------

  saveProduct() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.getRawValue();

    const payload = {
      ...productData,
      created_at: new Date().toISOString().split('T')[0],
      category: {
        id: productData.category.id
      }
    };

    this.productService.addProduct(payload).subscribe({
      next: () => {
        Swal.fire('Saved!', 'New product added to inventory.', 'success');

        this.loadProducts(); // ✅ auto refresh
        this.resetForm();
      },
      error: () => {
        Swal.fire('Error!', 'Product save failed!', 'error');
      }
    });
  }

  // ---------------- EDIT ----------------
  editProduct(p: Product) {
    this.productForm.patchValue(p);
    this.showForm = true;
    this.isEditing = true;
  }

  // ---------------- DELETE ----------------
  deleteProduct(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Product will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(+id).subscribe(() => {
          Swal.fire('Deleted!', 'Product removed.', 'success');
          this.loadProducts(); // ✅ refresh after delete
        });
      }
    });
  }

  // ---------------- FILTER ----------------
  // applyFilter(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = value.trim().toLowerCase();
  // }
}







// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product.model';

// // Material Imports
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatCardModule } from '@angular/material/card';

// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-product',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule, ReactiveFormsModule, 
//     MatTableModule, MatFormFieldModule, MatInputModule, 
//     MatSelectModule, MatButtonModule, MatChipsModule, MatCardModule
//   ],
//   templateUrl: './product.component.html',
//   styleUrl: './product.component.scss'
// })
// export class ProductComponent implements OnInit {
 
// }