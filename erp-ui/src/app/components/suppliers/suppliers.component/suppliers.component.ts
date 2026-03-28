// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { SuppliersService } from '../../../services/suppliers.service';
// import { Supplier } from '../../../models/supplier.model';
// import { SupplierDialogComponent } from '../supplier-dialog.component/supplier-dialog.component';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-suppliers',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//   ],
//   templateUrl: './suppliers.component.html',
//   styleUrls: ['./suppliers.component.scss']
// })
// export class SuppliersComponent implements OnInit {

//   private supplierService = inject(SuppliersService);
//   private dialog = inject(MatDialog);

//   suppliers: Supplier[] = [];
//   filteredSuppliers: Supplier[] = [];
//   searchTerm: string = '';

//   ngOnInit(): void {
//     this.loadSuppliers();
//   }

//   // ========================
//   // LOAD
//   // ========================
//   loadSuppliers(): void {
//     this.supplierService.getSuppliers().subscribe({
//       next: (res: Supplier[]) => {
//         this.suppliers = res ?? [];
//         this.applyFilter();
//       },
//       error: () => {
//         Swal.fire('Error', 'Failed to load suppliers', 'error');
//       }
//     });
//   }

//   // ========================
//   // FILTER
//   // ========================
//   applyFilter(): void {
//     const term = this.searchTerm.toLowerCase().trim();

//     if (!term) {
//       this.filteredSuppliers = [...this.suppliers];
//       return;
//     }

//     this.filteredSuppliers = this.suppliers.filter(s =>
//       s.name?.toLowerCase().includes(term) ||
//       s.mobileNumber?.includes(term) ||
//       s.tinNumber?.toLowerCase().includes(term)
//     );
//   }

//   // ========================
//   // OPEN DIALOG
//   // ========================
//   openSupplierDialog(supplier?: Supplier): void {

//     const dialogRef = this.dialog.open(SupplierDialogComponent, {
//       width: '700px',
//       data: supplier ? { ...supplier } : undefined
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.loadSuppliers(); // always refresh from API
//       }
//     });
//   }

//   // ========================
//   // DELETE
//   // ========================
//   // deleteSupplier(id: number): void {

//   //   Swal.fire({
//   //     title: 'Delete Confirmation',
//   //     text: 'This action cannot be undone.',
//   //     icon: 'warning',
//   //     showCancelButton: true,
//   //     confirmButtonColor: '#d33',
//   //     cancelButtonColor: '#6c757d',
//   //     confirmButtonText: 'Yes, Delete',
//   //     cancelButtonText: 'Cancel'
//   //   }).then(result => {

//   //     if (!result.isConfirmed) return;

//   //     this.supplierService.deleteSupplier(id).subscribe({
//   //       next: () => {
//   //         Swal.fire('Deleted', 'Supplier removed successfully.', 'success');
//   //         this.loadSuppliers();
//   //       },
//   //       error: () => {
//   //         Swal.fire('Error', 'Delete failed', 'error');
//   //       }
//   //     });

//   //   });
//   // }

// }



import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { SupplierDialogComponent } from '../supplier-dialog.component/supplier-dialog.component';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { SuppliersService } from '../../../services/suppliers.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
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
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  private supplierService = inject(SuppliersService);
  private dialog = inject(MatDialog);

  suppliers = signal<Supplier[]>([]);
  searchTerm = signal('');

  filteredSuppliers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return this.suppliers();

    return this.suppliers().filter(s =>
      s.name?.toLowerCase().includes(term) ||
      s.mobileNumber?.includes(term) ||
      s.tinNumber?.toLowerCase().includes(term)
    );
  });

  //active vendors
  activeVendorCount = computed(() =>
    this.filteredSuppliers().filter(s => s.status === 'ACTIVE').length
  );

  //inactive vendors
  inactiveVendorCount = computed(() => 
    this.filteredSuppliers().filter(n => n.status === 'INACTIVE').length
  );


  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers.set(res ?? []);
      },
      error: () => {
        Swal.fire('Error', 'Failed to load suppliers', 'error');
      }
    });
  }

  openSupplierDialog(supplier?: Supplier): void {

    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '700px',
      data: supplier ? { ...supplier } : undefined
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers(); // re-fetch
      }
    });
  }




  // ========================
  // DELETE
  // ========================
  deleteSupplier(id: number): void {

    Swal.fire({
      title: 'Delete Confirmation',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {

          // 🔥 Local state update (no reload)
          this.suppliers.update(list =>
            list.filter(s => s.id !== id)
          );

          Swal.fire('Deleted', 'Supplier removed successfully.', 'success');
        },
        error: () => {
          Swal.fire('Error', 'Delete failed', 'error');
        }
      });

    });
  }


}

