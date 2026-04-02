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
    MatBadgeModule
  ],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
})
export class PurchaseOrderComponent implements OnInit {


  private service = inject(PurchaseOrderService);
  private dialog = inject(MatDialog);

  orders = signal<PurchaseOrder[]>([]);

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

  openDialog() {
    const ref = this.dialog.open(PurchaseDialogComponent, {
      width: '900px'
    });

    ref.afterClosed().subscribe(res => {
      if (res) this.load();
    });
  }

  openViewDialog(id: any) {
    const ref = this.dialog.open(ViewPurchaseComponent, {
      width: '95vw',      // পুরো প্রায় screen width (responsive)
      maxWidth: '700px', // maximum width
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: id
    });
  }



  updateStatus(order: any, status: string) {
    // Confirmation for Cancel
    if (status === 'CANCELED') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to cancel this order?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.processUpdate(order, status);
        }
      });
    } else {
      // Approve ba Receive er jonno sorasori process hobe
      this.processUpdate(order, status);
    }
  }

  // Update process korar alada function (Code clean rakhar jonno)
  private processUpdate(order: any, status: string) {
    this.service.updateStatus(order.id!, status).subscribe({
      next: () => {
        this.orders.update(list =>
          list.map(o =>
            o.id === order.id ? { ...o, status: status as any } : o
          )
        );
        Swal.fire('Updated', `Order status is now ${status}`, 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Update failed', 'error');
      }
    });
  }

  delete(id: number) {

    Swal.fire({
      title: 'Delete?',
      icon: 'warning',
      showCancelButton: true
    }).then(r => {

      if (!r.isConfirmed) return;

      this.service.delete(id).subscribe(() => {
        this.orders.update(list => list.filter(o => o.id !== id));
        Swal.fire('Deleted', '', 'success');
      });
    });
  }



  getBadgeColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'PENDING':
        return 'warn'; // You can use 'warn' for pending status
      case 'APPROVED':
        return 'primary'; // 'primary' for approved status
      case 'RECEIVED':
        return 'accent'; // 'accent' for received status
      case 'CANCELED':
        return 'warn'; // 'warn' for canceled status
      default:
        return 'primary'; // Default to 'primary' if status is unknown
    }
  }
}
