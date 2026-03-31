import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { SalesResponse } from '../../../models/sales.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-history.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss',
})
export class SalesHistoryComponent implements OnInit {

  private salesService = inject(SalesService);

  sales = signal<SalesResponse[]>([]);
  searchText = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.loading.set(true);

    this.salesService.getAllSales().subscribe({
      next: (res) => {
        this.sales.set(res ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        Swal.fire('Error', 'Failed to load sales history', 'error');
      }
    });
  }

  filteredSales = computed(() => {
    const search = this.searchText().toLowerCase().trim();

    if (!search) return this.sales();

    return this.sales().filter(s =>
      (s.invoiceNumber || '').toLowerCase().includes(search) ||
      (s.customerName || '').toLowerCase().includes(search) ||
      (s.customerMobile || '').toLowerCase().includes(search) ||
      (s.sellerEmployeeName || '').toLowerCase().includes(search)
    );
  });
}