import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerLedgerService } from '../../../services/customer-ledger.service';
import { CustomerLedgerSummary } from '../../../models/customer-ledger.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-ledger.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer-ledger.component.html',
  styleUrl: './customer-ledger.component.scss',
})
export class CustomerLedgerComponent {
  
  customers = signal<CustomerLedgerSummary[]>([]);
  filteredCustomers = signal<CustomerLedgerSummary[]>([]);

  loading = false;

  searchText = '';
  filterType: 'ALL' | 'DUE_ONLY' | 'ZERO_BALANCE' = 'ALL';

  // isPaymentModalOpen = false;
  selectedCustomerId!: number;
  selectedCustomerName: string = '';

  constructor(
    private customerLedgerService: CustomerLedgerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = false;

    this.customerLedgerService.getCustomerLedgerSummary().subscribe({
      next: (res) => {
        this.customers.set(res);
        this.filteredCustomers.set([...res]);
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let data = [...this.customers()];

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();

      data = data.filter(s =>
        (s.customerName || '').toLowerCase().includes(search) ||
        (s.mobileNumber || '').toLowerCase().includes(search) ||
        (s.companyName || '').toLowerCase().includes(search)
      );
    }

    if (this.filterType === 'DUE_ONLY') {
      data = data.filter(s => s.currentDue > 0);
    }

    if (this.filterType === 'ZERO_BALANCE') {
      data = data.filter(s => s.currentDue === 0);
    }

    this.filteredCustomers.set(data);
  }

  viewLedger(customerId: number): void {
    this.router.navigate(['/admin-layout/app-customer-ledger-details', customerId]);
  }

  print(customer: CustomerLedgerSummary){}

  // openPaymentModal(supplier: CustomerLedgerSummary): void {
  //   this.selectedSupplierId = supplier.supplierId;
  //   this.selectedSupplierName = supplier.supplierName;
  //   this.isPaymentModalOpen = true;
  // }

  // closePaymentModal(): void {
  //   this.isPaymentModalOpen = false;
  // }

  // onPaymentSaved(): void {
  //   this.loadSummary();
  // }

}
