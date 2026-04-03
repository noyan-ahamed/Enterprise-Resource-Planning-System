import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order';
import { PurchaseDialogComponent } from '../purchase-dialog.component/purchase-dialog.component';
import { ViewPurchaseComponent } from '../view-purchase.component/view-purchase.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatSelect, MatOption } from "@angular/material/select";

@Component({
  selector: 'app-purchase-order.component',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatBadgeModule,
    MatSelect,
    MatOption
],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
})
export class PurchaseOrderComponent implements OnInit {

  private service = inject(PurchaseOrderService);
  private dialog = inject(MatDialog);

  orders = signal<PurchaseOrder[]>([]);

  // ✅ New: date filter signal
  filterRange = signal<'TODAY' | '7DAYS' | '15DAYS' | 'LASTMONTH' | 'LAST2MONTHS'>('TODAY');

  // ✅ Computed filtered list
  filteredOrders = computed(() => {
    const all = this.orders();
    const now = new Date();
    switch(this.filterRange()) {
      case 'TODAY':
        return all.filter(o => new Date(o.created_at as string).toDateString() === now.toDateString());
      case '7DAYS':
        return all.filter(o => new Date(o.created_at as string) >= new Date(now.getTime() - 7*24*60*60*1000));
      case '15DAYS':
        return all.filter(o => new Date(o.created_at as string) >= new Date(now.getTime() - 15*24*60*60*1000));
      case 'LASTMONTH':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return all.filter(o => {
          const d = new Date(o.created_at as string);
          return d >= lastMonth && d <= endLastMonth;
        });
      case 'LAST2MONTHS':
        const twoMonthAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const endLast2Month = new Date(now.getFullYear(), now.getMonth(), 0);
        return all.filter(o => {
          const d = new Date(o.created_at as string);
          return d >= twoMonthAgo && d <= endLast2Month;
        });
      default:
        return all;
    }
  });

  pendingCount = computed(() =>
    this.orders().filter(o => o.status === 'PENDING').length
  );

  receivedCount = computed(() =>
    this.orders().filter(o => o.status === 'RECEIVED').length
  );

  ngOnInit(): void {
    this.load();
    this.pendingCount;
    this.receivedCount;
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.orders.set(res ?? []);
    });
  }

  // ✅ Update filter
  setFilter(range: 'TODAY' | '7DAYS' | '15DAYS' | 'LASTMONTH' | 'LAST2MONTHS') {
    this.filterRange.set(range);
  }

  openDialog() {
    const ref = this.dialog.open(PurchaseDialogComponent, { width: '900px' });
    ref.afterClosed().subscribe(res => { if (res) this.load(); });
  }

  openViewDialog(id: any) {
    this.dialog.open(ViewPurchaseComponent, {
      width: '95vw',
      maxWidth: '700px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: id
    });
  }

  updateStatus(order: any, status: string) {
    if (status === 'CANCELLED') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to cancel this order?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
      }).then((result) => { if (result.isConfirmed) this.processUpdate(order, status); });
    } else {
      this.processUpdate(order, status)
    } ;

  }

  private processUpdate(order: any, status: string) {
    this.service.updateStatus(order.id!, status).subscribe({
      next: () => {
        this.orders.update(list =>
          list.map(o => o.id === order.id ? { ...o, status: status as any } : o)
        );
        // if status is received then send email
      if (status === 'RECEIVED') {
        this.triggerSendMail(order.id, status);
      }else if (status === 'CANCELLED'){
        this.triggerSendMail(order.id,status)
      } else {
        Swal.fire('Updated', `Order status is now ${status}`, 'success');
      }
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Update failed', 'error');
      }
    });
  }

  delete(id: number) {
    Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true }).then(r => {
      if (!r.isConfirmed) return;
      this.service.delete(id).subscribe(() => {
        this.orders.update(list => list.filter(o => o.id !== id));
        Swal.fire('Deleted', '', 'success');
      });
    });
  }

  getBadgeColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'APPROVED': return 'primary';
      case 'RECEIVED': return 'accent';
      case 'CANCELLED': return 'warn';
      default: return 'primary';
    }
  }

  generateReport(id: any) {
    this.service.getReport(id).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    });
  }

 triggerSendMail(id: number, status: string) {
  // loading before sending email
  Swal.fire({
    title: 'Sending Confirmation Mail...',
    text: 'Updating supplier via email',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  this.service.sendMail(id).subscribe({
    next: (response: any) => {
      Swal.fire('Success!', `Order ${status} and Email sent to supplier.`, 'success');
    },
    error: (err) => {

      Swal.fire('Partial Success', `Order ${status} but could not send email.`, 'warning');
      console.error('Mail Error:', err);
    }
  });
}
}