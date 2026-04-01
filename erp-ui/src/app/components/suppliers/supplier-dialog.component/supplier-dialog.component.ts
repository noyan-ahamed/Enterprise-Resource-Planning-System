import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { SuppliersService } from '../../../services/suppliers.service';
import { CreateSupplier, Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './supplier-dialog.component.html',
})
export class SupplierDialogComponent {

  supplierForm!: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private supplierService: SuppliersService,
    public dialogRef: MatDialogRef<SupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier | null
  ) {

    this.isEdit=!!data;

    // 🔥 ID control only in edit mode
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      companyName: [''],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:\+88|88)?(01[3-9]\d{8})$/)
        ]
      ],
      tinNumber: [''],
      address: [''],
      email:['',[Validators.required, Validators.email]],
      paymentTerms: [''],
      status: ['ACTIVE'],
      rating: [3],
      bankAccount: [''],
      bkashNo: ['']
    });
    // email validator pattern Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

    // If edit mode → patch + add ID
    if (data) {
      this.supplierForm.addControl('id', this.fb.control(data.id));
      this.supplierForm.patchValue(data);
    }
  }

  // ========================
  // SUBMIT
  // ========================
  onSubmit(): void {

    if (this.supplierForm.invalid) return;

    if (this.isEdit) {

      const payload: Supplier = this.supplierForm.value;
      this.supplierService.updateSupplier(payload.id!, payload).subscribe({
        
        
        next: () => {
          Swal.fire('Updated', 'Supplier info updated successfully', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          Swal.fire('Error', 'Update failed', 'error');
        }
        
      });

    } else {

      const payload: CreateSupplier = this.supplierForm.value;

      this.supplierService.addSupplier(payload).subscribe({
        next: () => {
          Swal.fire('Saved', 'New supplier added successfully', 'success');
          this.dialogRef.close(true);
        },
        error: () => {
          Swal.fire('Error', 'Save failed', 'error');
        }
      });

    }
  }
}
