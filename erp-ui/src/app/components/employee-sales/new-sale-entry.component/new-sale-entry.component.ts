import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { ProductSerivce } from '../../../services/product.service';
import { CustomerService } from '../../../services/customer.service';
import { Product } from '../../../models/product';
import { CustomerSearchResponse, QuickCustomerCreateRequest, SalesCreateRequest, SalesResponse } from '../../../models/sales.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-sale-entry.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-sale-entry.component.html',
  styleUrl: './new-sale-entry.component.scss',
})
export class NewSaleEntryComponent implements OnInit {

  private salesService = inject(SalesService);
  private productService = inject(ProductSerivce);
  private customerService = inject(CustomerService);

  products = signal<Product[]>([]);
  loading = signal(false);
  saving = signal(false);

  selectedCustomer = signal<CustomerSearchResponse | null>(null);
  customerSearchKeyword = signal('');

  customerFormVisible = signal(false);

  customerForm = signal<QuickCustomerCreateRequest>({
    name: '',
    companyName: '',
    email:'',
    mobileNumber: '',
    address: ''
  });

  saleForm = signal({
    sellerEmployeeId: 2, // পরে login user থেকে auto আসবে
    salesDate: this.todayDate(),
    remarks: '',
    discountPercent: 0,
    paidAmount: 0
  });

  saleItems = signal<any[]>([
    this.createEmptyItem()
  ]);

  selectedSaleResult = signal<SalesResponse | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res ?? []);
      },
      error: () => {
        Swal.fire('Error', 'Failed to load products', 'error');
      }
    });
  }

  createEmptyItem() {
    return {
      productId: '',
      sku: '',
      productName: '',
      availableStock: 0,
      unitPrice: 0,
      quantity: 1,
      lineTotal: 0
    };
  }

  addItemRow() {
    this.saleItems.update(items => [...items, this.createEmptyItem()]);
  }

  removeItemRow(index: number) {
    this.saleItems.update(items => {
      const updated = [...items];
      updated.splice(index, 1);
      return updated.length ? updated : [this.createEmptyItem()];
    });
  }

  onProductChange(index: number) {
    const items = [...this.saleItems()];
    const item = items[index];

    const product = this.products().find(p => p.id == item.productId);

    if (!product) return;

    item.productName = product.name;
    item.sku = product.sku;
    item.availableStock = Number(product.stock || 0);
    item.unitPrice = Number(product.sellingPrice || 0);

    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }

    item.lineTotal = item.quantity * item.unitPrice;

    this.saleItems.set(items);
  }

  onQuantityChange(index: number) {
    const items = [...this.saleItems()];
    const item = items[index];

    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }

    if (item.quantity > item.availableStock) {
      Swal.fire('Stock Warning', `Available stock is only ${item.availableStock}`, 'warning');
      item.quantity = item.availableStock || 1;
    }

    item.lineTotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    this.saleItems.set(items);
  }

  subTotal = computed(() =>
    this.saleItems().reduce((sum, item) => sum + Number(item.lineTotal || 0), 0)
  );

  discountAmount = computed(() => {
    const percent = Number(this.saleForm().discountPercent || 0);
    return (this.subTotal() * percent) / 100;
  });

  netTotal = computed(() =>
    this.subTotal() - this.discountAmount()
  );

  dueAmount = computed(() => {
    const paid = Number(this.saleForm().paidAmount || 0);
    const due = this.netTotal() - paid;
    return due < 0 ? 0 : due;
  });

  searchCustomerOnEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const keyword = this.customerSearchKeyword().trim();

    if (!keyword) {
      Swal.fire('Warning', 'Enter customer mobile or name', 'warning');
      return;
    }

    this.loading.set(true);

    this.salesService.searchCustomers(keyword).subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res && res.length > 0) {
          this.selectedCustomer.set(res[0]);
          this.customerFormVisible.set(false);

          Swal.fire({
            icon: 'success',
            title: 'Customer Found',
            text: `${res[0].name} selected`,
            timer: 1300,
            showConfirmButton: false
          });
        } else {
          this.selectedCustomer.set(null);

          Swal.fire({
            icon: 'question',
            title: 'Customer Not Found',
            text: 'Create new customer?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Create'
          }).then(result => {
            if (result.isConfirmed) {
              this.customerFormVisible.set(true);

              this.customerForm.set({
                name: '',
                companyName: '',
                email:'',
                mobileNumber: keyword,
                address: ''
              });
            }
          });
        }
      },
      error: () => {
        this.loading.set(false);
        Swal.fire('Error', 'Customer search failed', 'error');
      }
    });
  }

  saveQuickCustomer() {
    const customer = this.customerForm();

    if (!customer.name?.trim()) {
      Swal.fire('Warning', 'Customer name is required', 'warning');
      return;
    }

    if (!customer.mobileNumber?.trim()) {
      Swal.fire('Warning', 'Customer mobile number is required', 'warning');
      return;
    }

    this.customerService.quickCustomerCreate(customer).subscribe({
      next: (res: any) => {
        const selected: CustomerSearchResponse = {
          id: res.id,
          name: res.name,
          companyName: res.companyName,
          email: res.email,
          mobileNumber: res.mobileNumber,
          address: res.address
        };

        this.selectedCustomer.set(selected);
        this.customerFormVisible.set(false);

        Swal.fire('Success', 'Customer created and selected', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err?.error?.message || 'Customer creation failed', 'error');
      }
    });
  }

  clearSelectedCustomer() {
    this.selectedCustomer.set(null);
    this.customerSearchKeyword.set('');
    this.customerFormVisible.set(false);
  }

  updateSaleForm(field: string, value: any) {
    this.saleForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  updateCustomerForm(field: string, value: any) {
    this.customerForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  saveSale() {
    if (!this.selectedCustomer()) {
      Swal.fire('Warning', 'Select or create a customer first', 'warning');
      return;
    }

    const validItems = this.saleItems().filter(item => item.productId && item.quantity > 0);

    if (validItems.length === 0) {
      Swal.fire('Warning', 'Add at least one product', 'warning');
      return;
    }

    for (const item of validItems) {
      if (item.quantity > item.availableStock) {
        Swal.fire('Warning', `Insufficient stock for ${item.productName}`, 'warning');
        return;
      }
    }

    if (Number(this.saleForm().paidAmount || 0) > this.netTotal()) {
      Swal.fire('Warning', 'Paid amount cannot exceed net total', 'warning');
      return;
    }

    const payload: SalesCreateRequest = {
      customerId: this.selectedCustomer()?.id ?? null,
      sellerEmployeeId: this.saleForm().sellerEmployeeId,
      salesDate: this.saleForm().salesDate,
      discountAmount: this.discountAmount(), // percentage থেকে amount পাঠাচ্ছি
      paidAmount: Number(this.saleForm().paidAmount || 0),
      remarks: this.saleForm().remarks,
      items: validItems.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice) // backend ideally ignore করবে
      }))
    };

    this.saving.set(true);

    this.salesService.createSale(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.selectedSaleResult.set(res);

        Swal.fire({
          icon: 'success',
          title: 'Sale Completed',
          text: `Invoice: ${res.invoiceNumber}`,
          confirmButtonText: 'OK'
        });

        this.resetAll();
        this.loadProducts(); // stock refresh
      },
      error: (err) => {
        this.saving.set(false);
        Swal.fire('Error', err?.error?.message || 'Sale failed', 'error');
      }
    });
  }

  resetAll() {
    this.selectedCustomer.set(null);
    this.customerSearchKeyword.set('');
    this.customerFormVisible.set(false);

    this.customerForm.set({
      name: '',
      companyName: '',
      email:'',
      mobileNumber: '',
      address: ''
    });

    this.saleForm.set({
      sellerEmployeeId: 2,
      salesDate: this.todayDate(),
      remarks: '',
      discountPercent: 0,
      paidAmount: 0
    });

    this.saleItems.set([this.createEmptyItem()]);
  }
}
