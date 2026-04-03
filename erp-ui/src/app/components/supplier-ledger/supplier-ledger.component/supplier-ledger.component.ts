import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupplierLedgerSummary } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SupplierPaymentModalComponent } from '../supplier-payment-modal.component/supplier-payment-modal.component';

@Component({
  selector: 'app-supplier-ledger.component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule],
  templateUrl: './supplier-ledger.component.html',
  styleUrl: './supplier-ledger.component.scss',
})
export class SupplierLedgerComponent implements OnInit {
  private supplierLedgerService = inject(SupplierLedgerService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  suppliers = signal<SupplierLedgerSummary[]>([]);
  filteredSuppliers = signal<SupplierLedgerSummary[]>([]);
  loading = false;
  searchText = '';
  filterType = signal<'ALL' | 'DUE_ONLY' | 'ZERO_BALANCE'>('ALL');

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.supplierLedgerService.getSupplierLedgerSummary().subscribe({
      next: (res) => {
        this.suppliers.set(res || []);
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters(): void {
    let data = [...this.suppliers()];
    const search = this.searchText.toLowerCase().trim();

    if (search) {
      data = data.filter(s => 
        s.supplierName?.toLowerCase().includes(search) || 
        s.mobileNumber?.includes(search) || 
        s.companyName?.toLowerCase().includes(search)
      );
    }

    if (this.filterType() === 'DUE_ONLY') data = data.filter(s => s.currentDue > 0);
    if (this.filterType() === 'ZERO_BALANCE') data = data.filter(s => s.currentDue === 0);

    this.filteredSuppliers.set(data);
  }

  openPaymentModal(supplier: SupplierLedgerSummary) {
    const dialogRef = this.dialog.open(SupplierPaymentModalComponent, {
      width: '500px',
      data: { id: supplier.supplierId, name: supplier.supplierName },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSummary(); // যদি true আসে তবে রিলোড হবে
    });
  }

  viewLedger(id: number): void {
    this.router.navigate(['/admin-layout/app-supplier-ledger-details', id]);
  }
}