import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { SupplierPaymentRequest } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-payment-modal',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-payment-modal.component.html',
  styleUrl: './supplier-payment-modal.component.scss',
})
export class SupplierPaymentModalComponent {

  @Input() isOpen: boolean = false;
  @Input() supplierId!: number;
  @Input() supplierName: string = 'Supplier';

  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSaved = new EventEmitter<void>();

  loading = false;

  paymentMethods = ['CASH', 'BANK', 'BKASH', 'NAGAD'];

  paymentData: SupplierPaymentRequest = {
    supplierId: 0,
    amount: 0,
    paymentDate: '',
    paymentMethod: 'CASH',
    remarks: '',
    purchaseOrderId: null
  };

  constructor(private supplierLedgerService: SupplierLedgerService) {}

  ngOnChanges(): void {
    if (this.isOpen) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.paymentData = {
      supplierId: this.supplierId,
      amount: 0,
      paymentDate: this.todayDate(),
      paymentMethod: 'CASH',
      remarks: '',
      purchaseOrderId: null
    };
  }

  todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  savePayment(): void {
    if (!this.paymentData.amount || this.paymentData.amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid payment amount.'
      });
      return;
    }

    if (!this.paymentData.paymentDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Date',
        text: 'Please select payment date.'
      });
      return;
    }

    this.paymentData.supplierId = this.supplierId;
    this.loading = true;

    this.supplierLedgerService.createSupplierPayment(this.paymentData).subscribe({
      next: () => {
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Payment Saved',
          text: 'Supplier payment recorded successfully.',
          timer: 1800,
          showConfirmButton: false
        });

        this.paymentSaved.emit();
        this.close();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Could not save supplier payment.'
        });
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
