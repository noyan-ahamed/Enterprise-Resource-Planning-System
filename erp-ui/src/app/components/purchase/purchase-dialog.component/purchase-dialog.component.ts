import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Supplier } from '../../../models/supplier.model';
import { Product } from '../../../models/product';
import { PurchaseOrder } from '../../../models/purchase-order';
import { ProductSerivce } from '../../../services/product.service';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'app-purchase-dialog.component',
  imports: [ReactiveFormsModule,
    CommonModule, MatDialogContent,
    FormsModule, MatDialogActions, MatFormField, MatOption, MatLabel,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,],
  templateUrl: './purchase-dialog.component.html',
  styleUrl: './purchase-dialog.component.scss',
})

export class PurchaseDialogComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<PurchaseDialogComponent>);
  private supplierService = inject(SuppliersService);
  private productService = inject(ProductSerivce);
  private orderService = inject(PurchaseOrderService);
  private swal = inject(SwalService);

  newPurchase: any = {
    supplierId: '',
    paymentTerms: '',
    items: [],
    totalAmount: '',
    status: 'PENDING'
  };

  suppliers = signal<Supplier[]>([]);
  products = signal<Product[]>([]);

  supplierSearch: string = '';
  filteredSuppliers = signal<Supplier[]>([]);

  ngOnInit(): void {
    this.loadSupplier();
    this.loadProduct();
    this.addItem();
    this.calculateTotal(); // ✅ add this
  }

  // ✅ Load Suppliers
  loadSupplier() {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers.set(res);
        this.filteredSuppliers.set(res);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to load suppliers',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // ✅ Load Products
  loadProduct() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res);

        this.newPurchase.items.forEach((item: any) => {
        item.filteredProducts = res;
      });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to load products',
          confirmButtonText: 'OK'
        });
      }
    });
  }


  // ✅ Filter Supplier
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
  
  if (!search) {
    this.newPurchase.items[index].filteredProducts = this.products();
    return;
  }

  const filtered = this.products().filter(p =>
    p.name.toLowerCase().includes(search)
  );

  this.newPurchase.items[index].filteredProducts = filtered;
}


  // ✅ Add Item
  addItem() {
    this.newPurchase.items.push({
      productId: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0,
      search: '',
      filteredProducts: this.products()
    });
  }

  // ✅ Remove Item
  removeItem(index: number) {
    this.newPurchase.items.splice(index, 1);
    this.calculateTotal();
  }

  // ✅ Calculate Total
  calculateTotal() {
    this.newPurchase.totalAmount = this.newPurchase.items.reduce((acc: any, item: any) => {
      item.lineTotal = item.quantity * item.unitPrice;
      return acc + item.lineTotal;
    }, 0);
  }

  // ✅ MAIN FUNCTION (Create + PDF)
 createPurchase() {
  Swal.fire({
    title: 'Creating...',
    text: 'Please wait while we process your order',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  this.orderService.create(this.newPurchase).subscribe({
    next: (res: any) => {
      const orderId = res.id;
      Swal.close(); 
    
        this.dialogRef.close(true); 

      // ✅ সাকসেস মেসেজ (ডায়ালগের ওপরে দেখানোর জন্য পজিশন ঠিক করা)
      Swal.fire({
        icon: 'success',
        title: 'Order Created!',
        text: 'Purchase Order Created Successfully',
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-file-pdf"></i> View PDF',
        denyButtonText: '<i class="fa fa-envelope"></i> Send Email',
        cancelButtonText: 'Close',
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#28a745',
        customClass: {
          actions: 'my-actions',
          confirmButton: 'order-1',
          denyButton: 'order-2',
          cancelButton: 'order-3',
        },
        target: 'body' // নিশ্চিত করা যে এটি ডায়ালগের ওপরে আসবে
      }).then((result) => {
        // PDF ওপেন করা
        if (result.isConfirmed) {
          this.viewInvoicePDF(orderId);
          this.dialogRef.close(true); 
        } 
      
        else if (result.isDenied) {
          this.triggerSendMail(orderId);
          this.dialogRef.close(true);
        }
        // ৩. শুধু ক্লোজ করলে
        else {
          this.dialogRef.close(true);
        }

       
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || 'Failed to create purchase order'
      });
    }
  });
}

private viewInvoicePDF(id: number) {
  this.orderService.getReport(id).subscribe({
    next: (blob) => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    },
    error: (err) => console.error('PDF Load Error:', err)
  });
}

// for sending mail
private triggerSendMail(id: number) {
  Swal.fire({ title: 'Sending Mail...', didOpen: () => Swal.showLoading() });
  
  this.orderService.sendMail(id).subscribe({
    next: (response: any) => {
      Swal.fire('Sent!', 'Email has been sent to supplier.', 'success');
    },
    error: (err) => {
      Swal.fire('Failed!', 'Could not send email.', 'error');
    }
  });
}

  // ✅ Cancel Dialog
 onCancel() {
  this.dialogRef.close(false); // true দিলে অযথা load() কল হবে
}
}