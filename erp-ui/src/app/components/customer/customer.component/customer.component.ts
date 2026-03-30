import { Component, computed, inject, signal } from '@angular/core';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Customer } from '../../../models/customer.model';
import Swal from 'sweetalert2';
import { CustomerDialogComponent } from '../customer-dialog.component/customer-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customer.component',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent {
  private customerService = inject(CustomerService);
  private dialog = inject(MatDialog);

  loading =false;

  customers = signal<Customer[]>([]);
  searchTerm = signal('');

   filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return this.customers();

    return this.customers().filter(c =>
      c.name?.toLowerCase().includes(term) ||
      c.mobileNumber?.includes(term) 
      // ||
      // c.tinNumber?.toLowerCase().includes(term)
    );
  });




  ngOnInit(): void {
      this.loadCustomer();
    }
  
    loadCustomer(): void {
      this.loading= false;
      this.customerService.getCustomer().subscribe({
        next: (res) => {
          this.customers.set(res ?? []);
        },
        error: () => {
          Swal.fire('Error', 'Failed to load suppliers', 'error');
        }
      });
    }


     openCustomerDialog(customer?: Customer): void {
    
        const dialogRef = this.dialog.open(CustomerDialogComponent, {
          width: '700px',
          data: customer ? { ...customer } : undefined
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadCustomer(); // re-fetch
          }
        });
      }



       // ========================
        // DELETE
        // ========================
        deleteCustomer(id: number): void {
      
          Swal.fire({
            title: 'Delete Confirmation',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
          }).then(result => {
      
            if (!result.isConfirmed) return;
      
            this.customerService.deleteCustomer(id).subscribe({
              next: () => {
      
                // 🔥 Local state update (no reload)
                this.customers.update(list =>
                  list.filter(c => c.id !== id)
                );
      
                Swal.fire('Deleted', 'Customer removed successfully.', 'success');
              },
              error: () => {
                Swal.fire('Error', 'Delete failed', 'error');
              }
            });
      
          });
        }
      
}
