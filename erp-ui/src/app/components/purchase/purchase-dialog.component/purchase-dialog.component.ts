import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Supplier } from '../../../models/supplier.model';
import { Product } from '../../../models/product';
import { PurchaseOrder } from '../../../models/purchase-order';
import { ProductSerivce } from '../../../services/product.service';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/select";

@Component({
  selector: 'app-purchase-dialog.component',
  imports: [ReactiveFormsModule,
    CommonModule, MatDialogContent,
    FormsModule, MatDialogActions, MatFormField, MatOption, MatLabel],
  templateUrl: './purchase-dialog.component.html',
  styleUrl: './purchase-dialog.component.scss',
})

export class PurchaseDialogComponent implements OnInit{
  newPurchase: any= {
    supplierId: '',
    paymentTerms: '',
    items: [],
    totalAmount: '',
    status: 'PENDING'
  };

  private supplierService = inject(SuppliersService);
  private productService = inject(ProductSerivce);
  private orderService = inject(PurchaseOrderService)

  suppliers = signal<Supplier[]>([]); // Load from API
  products = signal< Product[]>([]);   // Load from API



  supplierSearch: string = '';
filteredSuppliers = signal<Supplier[]>([]);

  ngOnInit(): void {
    this.loadSupplier();
    this.loadProduct();
  }

  loadSupplier(){
    this.supplierService.getSuppliers().subscribe(
      {
        next: (res)=>{
          this.suppliers.set(res);
          // ✅ INIT FILTER LIST
      this.filteredSuppliers.set(res);
        },
      error: () => {
        alert('Failed to load suppliers');
      }
      
      }
    )
  }


  filterSuppliers() {
  const search = this.supplierSearch.toLowerCase();

  const filtered = this.suppliers().filter(s =>
    s.name.toLowerCase().includes(search) ||
    s.mobileNumber.includes(search)
  );

  this.filteredSuppliers.set(filtered);
}

filterProducts(index: number) {

  const search = this.newPurchase.items[index].search.toLowerCase();

  const filtered = this.products().filter(p =>
    p.name.toLowerCase().includes(search)
  );

  this.newPurchase.items[index].filteredProducts = filtered;
}

  loadProduct(){
    this.productService.getProducts().subscribe(
      {
        next: (res) =>{
          this.products.set(res);
        }
      }
    )
  }

  addItem() {
    this.newPurchase.items.push({ 
      productId: '', 
      quantity: 1, 
      unitPrice: 0, 
      lineTotal: 0 ,

       // ✅ NEW
    search: '',
    filteredProducts: this.products()
    });
  }

  removeItem(index: number) {
    this.newPurchase.items.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.newPurchase.totalAmount = this.newPurchase.items.reduce((acc:any, item:any) => {
      item.lineTotal = item.quantity * item.unitPrice;
      return acc + item.lineTotal;
    }, 0);
  }

  onSubmit() {
    // API Call then close
    this.orderService.create(this.newPurchase).subscribe(
      {
        next: () => {
        alert('Designation Inserted Successfully!');
      },
      error: () => {
        alert('Designation Insertion Failed!');
      }
      }
    );
  }


onCancel() {

}
}
