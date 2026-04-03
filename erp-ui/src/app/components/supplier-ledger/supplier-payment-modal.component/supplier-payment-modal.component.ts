import { Component, inject, OnInit } from '@angular/core';
import { SupplierPaymentRequest } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-supplier-payment-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './supplier-payment-modal.component.html',
  styleUrl: './supplier-payment-modal.component.scss',
})
export class SupplierPaymentModalComponent implements OnInit {
  // Injectors
  private dialogRef = inject(MatDialogRef<SupplierPaymentModalComponent>);
  private data = inject(MAT_DIALOG_DATA); // { id: number, name: string }
  private supplierLedgerService = inject(SupplierLedgerService);

  supplierId = this.data.id;
  supplierName = this.data.name;
  loading = false;
  paymentMethods = ['CASH', 'BANK', 'BKASH', 'NAGAD'];

  paymentData: SupplierPaymentRequest = {
    supplierId: this.supplierId,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    remarks: '',
    purchaseOrderId: null
  };

  ngOnInit(): void {}

  savePayment(): void {
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid amount.' });
      return;
    }

    this.loading = true;
    this.supplierLedgerService.createSupplierPayment(this.paymentData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Payment Saved',
          timer: 1500,
          showConfirmButton: false
        });
        this.dialogRef.close(true); // Success হলে true রিটার্ন করবে
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Payment Failed' });
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}