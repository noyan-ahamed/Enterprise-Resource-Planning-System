import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierPaymentModalComponent } from '../supplier-payment-modal.component/supplier-payment-modal.component';
import { SupplierLedgerSummary } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';

@Component({
  selector: 'app-supplier-ledger.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SupplierPaymentModalComponent
  ],
  templateUrl: './supplier-ledger.component.html',
  styleUrl: './supplier-ledger.component.scss',
})
export class SupplierLedgerComponent {

  suppliers = signal<SupplierLedgerSummary[]>([]);
  filteredSuppliers = signal<SupplierLedgerSummary[]>([]);

  loading = false;

  searchText = '';
  filterType: 'ALL' | 'DUE_ONLY' | 'ZERO_BALANCE' = 'ALL';

  isPaymentModalOpen = false;
  selectedSupplierId!: number;
  selectedSupplierName: string = '';

  constructor(
    private supplierLedgerService: SupplierLedgerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;

    this.supplierLedgerService.getSupplierLedgerSummary().subscribe({
      next: (res) => {
        this.suppliers.set(res);
        this.filteredSuppliers.set([...res]);
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
    let data = [...this.suppliers()];

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();

      data = data.filter(s =>
        (s.supplierName || '').toLowerCase().includes(search) ||
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

    this.filteredSuppliers.set(data);
  }

  viewLedger(supplierId: number): void {
    this.router.navigate(['/admin-layout/supplier-ledger', supplierId]);
  }

  openPaymentModal(supplier: SupplierLedgerSummary): void {
    this.selectedSupplierId = supplier.supplierId;
    this.selectedSupplierName = supplier.supplierName;
    this.isPaymentModalOpen = true;
  }

  closePaymentModal(): void {
    this.isPaymentModalOpen = false;
  }

  onPaymentSaved(): void {
    this.loadSummary();
  }
}
