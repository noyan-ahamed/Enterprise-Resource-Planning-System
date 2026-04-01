import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './customer-dialog.component.html',
})
export class CustomerDialogComponent {

  customer: Customer = {
    id: 0,
    name: '',
    mobileNumber: '',
    email: '',
    companyName: '',
    address: ''
  };

  isEdit: boolean = false;

  constructor(
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer | null
  ) {
    if (data) {
      this.isEdit = true;
      this.customer = { ...data };
    }
  }

  // ========================
  // SUBMIT
  // ========================
  onSubmit(form: NgForm): void {

    if (form.invalid) return;

    if (this.isEdit) {

      this.customerService.updateCustomer(this.customer.id, this.customer).subscribe({
        next: () => {
          Swal.fire('Updated', 'Customer updated successfully', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          Swal.fire('Error', 'Update failed', 'error');
        }
      });

    } else {

      this.customerService.addCustomer(this.customer).subscribe({
        next: () => {
          Swal.fire('Saved', 'Customer added successfully', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          Swal.fire('Error', 'Save failed', 'error');
        }
      });

    }
  }
}