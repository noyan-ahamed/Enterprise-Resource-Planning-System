import { Component, inject, OnInit, signal } from '@angular/core';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  orders = signal<PurchaseOrder | null>(null);

  ngOnInit(): void {
    this.load(this.data);
  }

  load(id: any) {
    this.service.getById(id).subscribe(res => {
      console.log('API Response:', res);
      this.orders.set(res);
    });
  }

  printInvoice(){

  }

  closeModal(){

  }
}