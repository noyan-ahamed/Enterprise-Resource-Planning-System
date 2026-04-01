import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerPaymentService } from '../../services/customer-payment.service';
import { CustomerDueSummary, CustomerPaymentCreateRequest, CustomerPaymentResponse } from '../../models/customer-due-collection.model';



@Component({
  selector: 'app-customer-due-collection',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-due-collection.component.html',
  styleUrl: './customer-due-collection.component.scss',
})
export class CustomerDueCollectionComponent implements OnInit {

  private customerPaymentService = inject(CustomerPaymentService);

  loading = signal(false);
  saving = signal(false);

  customerSearchKeyword = signal('');
  selectedCustomer = signal<CustomerDueSummary | null>(null);

  paymentFormVisible = signal(false);

  paymentForm = signal({
    customerId: 0,
    salesOrderId: null as number | null,
    receivedByEmployeeId: 2, // later login user থেকে আসবে
    amount: 0,
    paymentDate: this.todayDate(),
    paymentMethod: 'CASH',
    remarks: ''
  });

  paymentHistory = signal<CustomerPaymentResponse[]>([]);

  totalPendingPayments = computed(() =>
    this.paymentHistory().filter(p => p.status === 'PENDING').reduce((sum, p) => sum + Number(p.amount || 0), 0)
  );

  ngOnInit(): void {}

  todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  searchCustomerOnEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const keyword = this.customerSearchKeyword().trim();

    if (!keyword) {
      Swal.fire('Warning', 'Enter customer mobile or name', 'warning');
      return;
    }

    this.loading.set(true);

    this.customerPaymentService.getCustomerDueSummary(keyword).subscribe({
      next: (res) => {
        this.loading.set(false);

        this.selectedCustomer.set(res);
        this.paymentFormVisible.set(true);

        this.paymentForm.update(form => ({
          ...form,
          customerId: res.customerId,
          amount: 0,
          paymentDate: this.todayDate(),
          remarks: ''
        }));

        this.loadCustomerPaymentHistory(res.customerId);

        Swal.fire({
          icon: 'success',
          title: 'Customer Found',
          text: `${res.customerName} loaded successfully`,
          timer: 1300,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.selectedCustomer.set(null);
        this.paymentFormVisible.set(false);
        this.paymentHistory.set([]);

        Swal.fire(
          'Not Found',
          err?.error?.message || 'Customer not found or no due summary available',
          'warning'
        );
      }
    });
  }

  loadCustomerPaymentHistory(customerId: number) {
    this.customerPaymentService.getPaymentsByCustomer(customerId).subscribe({
      next: (res) => {
        this.paymentHistory.set(res ?? []);
      },
      error: () => {
        this.paymentHistory.set([]);
      }
    });
  }

  updatePaymentForm(field: string, value: any) {
    this.paymentForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  clearSelectedCustomer() {
    this.selectedCustomer.set(null);
    this.customerSearchKeyword.set('');
    this.paymentFormVisible.set(false);
    this.paymentHistory.set([]);

    this.paymentForm.set({
      customerId: 0,
      salesOrderId: null,
      receivedByEmployeeId: 2,
      amount: 0,
      paymentDate: this.todayDate(),
      paymentMethod: 'CASH',
      remarks: ''
    });
  }

  savePayment() {
    const customer = this.selectedCustomer();
    const form = this.paymentForm();

    if (!customer) {
      Swal.fire('Warning', 'Search and select a customer first', 'warning');
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      Swal.fire('Warning', 'Enter a valid payment amount', 'warning');
      return;
    }

    if (Number(form.amount) > Number(customer.currentDue || 0)) {
      Swal.fire('Warning', 'Payment amount cannot exceed current due', 'warning');
      return;
    }

    const payload: CustomerPaymentCreateRequest = {
      customerId: customer.customerId,
      salesOrderId: form.salesOrderId,
      receivedByEmployeeId: form.receivedByEmployeeId,
      amount: Number(form.amount),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      remarks: form.remarks
    };

    this.saving.set(true);

    this.customerPaymentService.createCustomerPayment(payload).subscribe({
      next: (res) => {
        this.saving.set(false);

        Swal.fire({
          icon: 'success',
          title: 'Payment Submitted',
          text: `Voucher: ${res.voucherNo}`,
          confirmButtonText: 'OK'
        });

        if (customer) {
          this.loadCustomerPaymentHistory(customer.customerId);

          // UI side temporary update: due immediately কমাবো না
          // কারণ approval এর আগে actual due finalized হবে না
        }

        this.paymentForm.update(form => ({
          ...form,
          amount: 0,
          paymentDate: this.todayDate(),
          paymentMethod: 'CASH',
          remarks: ''
        }));
      },
      error: (err) => {
        this.saving.set(false);
        Swal.fire('Error', err?.error?.message || 'Payment submission failed', 'error');
      }
    });
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-warning text-dark';
    }
  }
}
