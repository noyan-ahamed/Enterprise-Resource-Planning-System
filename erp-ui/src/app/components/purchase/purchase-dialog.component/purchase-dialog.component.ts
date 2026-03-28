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

@Component({
  selector: 'app-purchase-dialog.component',
  imports: [ReactiveFormsModule,
    CommonModule, MatDialogContent,
    FormsModule, MatDialogActions],
  templateUrl: './purchase-dialog.component.html',
  styleUrl: './purchase-dialog.component.scss',
})
// export class PurchaseDialogComponent {

//   private service = inject(PurchaseOrderService);
//   private supplierService = inject(SuppliersService);
//   dialogRef = inject(MatDialogRef<PurchaseDialogComponent>);

//   suppliers = signal<any[]>([]);


//   // get items() {
//   //   return this.form.get('items') as FormArray;
//   // }

//   constructor() {
//     this.loadSuppliers();
//     this.addRow();
//   }

//   loadSuppliers() {
//     this.supplierService.getSuppliers().subscribe(res => {
//       this.suppliers.set(res);
//     });
//   }

//   addRow() {
//     this.items.push(
//       this.fb.group({
//         productId: [null, Validators.required],
//         quantity: [1, Validators.required],
//         price: [0, Validators.required]
//       })
//     );
//   }

//   removeRow(i: number) {
//     this.items.removeAt(i);
//   }

//  submit() {

//   if (this.form.invalid) return;

//   const raw = this.form.getRawValue();

//   const payload = {
//     supplierId: raw.supplierId!, // 🔥 null remove
//     paymentTerms: raw.paymentTerms ?? '',
//     items: raw.items.map((i: any) => ({
//       productId: i.productId!,
//       quantity: i.quantity!,
//       price: i.price!
//     }))
//   };

//   this.service.create(payload).subscribe(() => {
//     Swal.fire('Created', '', 'success');
//     this.dialogRef.close(true);
//   });
// }


//   // helper
//   getItemControl(item: any, name: string) {
//   return item.get(name);
// }
// }

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

  ngOnInit(): void {
    this.loadSupplier();
    this.loadProduct();
  }

  loadSupplier(){
    this.supplierService.getSuppliers().subscribe(
      {
        next: (res)=>{
          this.suppliers.set(res);
        },
      error: () => {
        alert('Failed to load suppliers');
      }
      }
    )
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
    this.newPurchase.items.push({ productId: '', quantity: 1, unitPrice: 0, lineTotal: 0 });
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


onCancel(){

}
}
