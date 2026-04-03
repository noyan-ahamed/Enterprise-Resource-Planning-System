import { CommonModule, DecimalPipe, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupplierDetail, SupplierLedgerEntry, SupplierLedgerSummary } from '../../../models/supplier-ledger.model';
import { SupplierLedgerService } from '../../../services/supplier-ledger.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SupplierPaymentModalComponent } from '../supplier-payment-modal.component/supplier-payment-modal.component';

@Component({
  selector: 'app-supplier-ledger-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe, MatDialogModule],
  templateUrl: './supplier-ledger-details.component.html',
  styleUrl: './supplier-ledger-details.component.scss',
})
export class SupplierLedgerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supplierLedgerService = inject(SupplierLedgerService);
  private location = inject(Location);
  private dialog = inject(MatDialog);

  supplierId!: number;
  ledgerEntries = signal<SupplierLedgerEntry[]>([]);
  supplierSummary = signal<SupplierLedgerSummary | null>(null);
  supplierDetail = signal<SupplierDetail | null>(null);
  loading = false;

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    // সমান্তরালভাবে ডাটা লোড করার জন্য একাধিক কল
    this.supplierLedgerService.getSupplierLedgerById(this.supplierId).subscribe(res => this.ledgerEntries.set(res));
    this.supplierLedgerService.getSupplierDueSummaryById(this.supplierId).subscribe(res => this.supplierSummary.set(res));
    this.supplierLedgerService.getSupplierById(this.supplierId).subscribe({
      next: (res) => { this.supplierDetail.set(res); this.loading = false; },
      error: () => this.loading = false
    });
  }

  openPaymentModal(): void {
    const dialogRef = this.dialog.open(SupplierPaymentModalComponent, {
      width: '500px',
      data: { id: this.supplierId, name: this.supplierSummary()?.supplierName || 'Supplier' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  goBack(): void { this.location.back(); }
  formatType(type: string): string { return type?.replaceAll('_', ' ') || '-'; }
}