import { Component, inject, OnInit, signal } from '@angular/core';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-purchase',
  imports:[DatePipe,
    CommonModule
  ],
  templateUrl: './view-purchase.component.html',
  styleUrls: ['./view-purchase.component.scss'], // corrected
})
export class ViewPurchaseComponent implements OnInit {
  private data = inject(MAT_DIALOG_DATA);
  private service = inject(PurchaseOrderService);


  // ✅ Inject MatDialogRef
  private dialogRef = inject(MatDialogRef<ViewPurchaseComponent>);

  orders = signal<PurchaseOrder | null>(null);

  ngOnInit(): void {
    this.load(this.data);
  }

  load(id: any) {
    this.service.getById(id).subscribe(res => {
      this.orders.set(res);
    });
  }

  printInvoice(id: any){
    this.service.getReport(id).subscribe(
      blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);}
    )
  }

  // ✅ Close modal properly
  closeModal() {
    this.dialogRef.close(); // Close dialog
  }
}