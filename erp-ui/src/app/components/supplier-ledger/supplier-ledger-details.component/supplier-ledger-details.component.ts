import { CommonModule, DecimalPipe, Location } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { SupplierDetail, SupplierLedgerEntry, SupplierLedgerSummary } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';
import { SupplierPaymentModalComponent } from '../supplier-payment-modal.component/supplier-payment-modal.component';

@Component({
  selector: 'app-supplier-ledger-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DecimalPipe,
    SupplierPaymentModalComponent
  ],
  templateUrl: './supplier-ledger-details.component.html',
  styleUrl: './supplier-ledger-details.component.scss',
})
export class SupplierLedgerDetailsComponent {

  supplierId!: number;

  ledgerEntries = signal<SupplierLedgerEntry[]>([]);
  supplierSummary: SupplierLedgerSummary | null = null;
  supplierDetail: SupplierDetail | null = null;

  loading = false;
  isPaymentModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private supplierLedgerService: SupplierLedgerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.supplierLedgerService.getSupplierLedgerById(this.supplierId).subscribe({
      next: (res) => {
        this.ledgerEntries.set(res);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    this.supplierLedgerService.getSupplierDueSummaryById(this.supplierId).subscribe({
      next: (res) => this.supplierSummary = res,
      error: (err) => console.error(err)
    });

    this.supplierLedgerService.getSupplierById(this.supplierId).subscribe({
      next: (res) => this.supplierDetail = res,
      error: (err) => console.warn('Supplier details not available', err)
    });
  }

  openPaymentModal(): void {
    this.isPaymentModalOpen = true;
  }

  closePaymentModal(): void {
    this.isPaymentModalOpen = false;
  }

  onPaymentSaved(): void {
    this.closePaymentModal();
    this.loadData();
  }

  goBack(): void {
    this.location.back();
  }

  formatType(type: string): string {
    return type?.replaceAll('_', ' ') || '-';
  }
}
