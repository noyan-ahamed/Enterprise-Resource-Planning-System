import { Component, signal } from '@angular/core';
import { CustomerLedgerEntry, CustomerLedgerSummary } from '../../../models/customer-ledger.model';
import { Customer } from '../../../models/customer.model';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerLedgerService } from '../../../services/customer-ledger.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customer-ledger-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DecimalPipe,
  ],
  templateUrl: './customer-ledger-details.component.html',
  styleUrl: './customer-ledger-details.component.scss',
})
export class CustomerLedgerDetailsComponent {

  customerId!: number;

  ledgerEntries = signal<CustomerLedgerEntry[]>([]);
 customerSummary = signal<CustomerLedgerSummary | null>(null);
customerDetail = signal<Customer | null>(null);

  loading = false;
  // isPaymentModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private customerLedgerService: CustomerLedgerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.customerLedgerService.getCustomerLedgerById(this.customerId).subscribe({
      next: (res) => {
        this.ledgerEntries.set(res);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    this.customerLedgerService.getCustomerDueSummaryById(this.customerId).subscribe({
      next: (res) => {
        this.customerSummary.set(res);
        this.loading = false;
      },
      error: (err) => {console.error(err), this.loading = false;}
    });

    this.customerLedgerService.getCustomerById(this.customerId).subscribe({
      next: (res) => {this.customerDetail.set(res), this.loading = false;},
      error: (err) => {console.warn('Customer details not available', err), this.loading = false;}
    });
  }

 

  goBack(): void {
    this.location.back();
  }

  formatType(type: string): string {
    return type?.replaceAll('_', ' ') || '-';
  }

}
