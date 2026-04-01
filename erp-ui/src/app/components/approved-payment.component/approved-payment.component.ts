import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  CustomerPaymentApprovalRequest,
  CustomerPaymentResponse
} from '../../models/customer-due-collection.model';
import { CustomerPaymentService } from '../../services/customer-payment.service';

@Component({
  selector: 'app-approved-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approved-payment.component.html',
  styleUrl: './approved-payment.component.scss'
})
export class ApprovedPaymentComponent implements OnInit {

  private customerPaymentService = inject(CustomerPaymentService);

  loading = signal(false);
  actionLoadingId = signal<number | null>(null);

  // top tab
  activeModule = signal<'CUSTOMER_PAYMENT' | 'PAYROLL'>('CUSTOMER_PAYMENT');

  // customer payment section
  searchKeyword = signal('');
  selectedStatus = signal<'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'>('PENDING_APPROVAL');

  customerPayments = signal<CustomerPaymentResponse[]>([]);

  // later login user থেকে আসবে
  adminUserId = signal<number>(1);

  ngOnInit(): void {
    this.loadCustomerPayments();
  }

  // =========================
  // Computed
  // =========================
  totalCount = computed(() => this.customerPayments().length);

  totalPending = computed(() =>
    this.customerPayments().filter(p => p.status === 'PENDING_APPROVAL').length
  );

  totalApproved = computed(() =>
    this.customerPayments().filter(p => p.status === 'APPROVED').length
  );

  totalRejected = computed(() =>
    this.customerPayments().filter(p => p.status === 'REJECTED').length
  );

  totalPendingAmount = computed(() =>
    this.customerPayments()
      .filter(p => p.status === 'PENDING_APPROVAL')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)
  );

  // =========================
  // Module Switch
  // =========================
  setActiveModule(module: 'CUSTOMER_PAYMENT' | 'PAYROLL') {
    this.activeModule.set(module);

    if (module === 'CUSTOMER_PAYMENT') {
      this.loadCustomerPayments();
    }

    // PAYROLL হলে পরে load method call করবা
  }

  // =========================
  // Customer Payment Approval
  // =========================
  loadCustomerPayments() {
    this.loading.set(true);

    this.customerPaymentService
      .getAdminPaymentList(this.searchKeyword().trim(), this.selectedStatus())
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.customerPayments.set(res ?? []);
        },
        error: (err) => {
          this.loading.set(false);
          this.customerPayments.set([]);
          Swal.fire('Error', err?.error?.message || 'Failed to load customer payments', 'error');
        }
      });
  }

  searchOnEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.loadCustomerPayments();
  }

  onStatusChange(value: 'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED') {
    this.selectedStatus.set(value);
    this.loadCustomerPayments();
  }

  clearFilters() {
    this.searchKeyword.set('');
    this.selectedStatus.set('PENDING_APPROVAL');
    this.loadCustomerPayments();
  }

  approvePayment(payment: CustomerPaymentResponse) {
    Swal.fire({
      icon: 'question',
      title: 'Approve Payment?',
      text: `Voucher: ${payment.voucherNo}`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.actionLoadingId.set(payment.id);

      const payload: CustomerPaymentApprovalRequest = {
        approvedByUserId: this.adminUserId()
      };

      this.customerPaymentService.approvePayment(payment.id, payload).subscribe({
        next: (res) => {
          this.actionLoadingId.set(null);

          this.customerPayments.update(list =>
            list.map(item => item.id === payment.id ? res : item)
          );

          Swal.fire({
            icon: 'success',
            title: 'Approved',
            text: `Voucher ${res.voucherNo} approved successfully`,
            timer: 1400,
            showConfirmButton: false
          });

          // if filter is pending only, refresh to remove approved row
          if (this.selectedStatus() === 'PENDING_APPROVAL') {
            this.loadCustomerPayments();
          }
        },
        error: (err) => {
          this.actionLoadingId.set(null);
          Swal.fire('Error', err?.error?.message || 'Approval failed', 'error');
        }
      });
    });
  }

  rejectPayment(payment: CustomerPaymentResponse) {
    Swal.fire({
      icon: 'warning',
      title: 'Reject Payment?',
      text: `Voucher: ${payment.voucherNo}`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.actionLoadingId.set(payment.id);

      const payload: CustomerPaymentApprovalRequest = {
        approvedByUserId: this.adminUserId()
      };

      this.customerPaymentService.rejectPayment(payment.id, payload).subscribe({
        next: (res) => {
          this.actionLoadingId.set(null);

          this.customerPayments.update(list =>
            list.map(item => item.id === payment.id ? res : item)
          );

          Swal.fire({
            icon: 'success',
            title: 'Rejected',
            text: `Voucher ${res.voucherNo} rejected successfully`,
            timer: 1400,
            showConfirmButton: false
          });

          if (this.selectedStatus() === 'PENDING_APPROVAL') {
            this.loadCustomerPayments();
          }
        },
        error: (err) => {
          this.actionLoadingId.set(null);
          Swal.fire('Error', err?.error?.message || 'Reject failed', 'error');
        }
      });
    });
  }

  canTakeAction(status: string): boolean {
    return status === 'PENDING_APPROVAL';
  }

  isRowActionLoading(paymentId: number): boolean {
    return this.actionLoadingId() === paymentId;
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

  // =========================
  // Payroll Placeholder
  // =========================
  loadPayrollApprovals() {
    // TODO:
    // HR generated payroll list এখানে load হবে
    // পরে payroll approval api ready হলে এখানে call বসাবে
  }

  approvePayroll() {
    // TODO:
    // payroll approve API call
  }

  rejectPayroll() {
    // TODO:
    // payroll reject API call
  }
}
