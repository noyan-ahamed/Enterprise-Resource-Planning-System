import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdcutCategoryService } from '../../services/prodcut-category.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { createCategory, ProductCategoryModel } from '../../models/product-category.model';
@Component({
  selector: 'app-product-category',
  imports: [FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    MatButton
  ],
  templateUrl: './product-category.html',
  styleUrl: './product-category.scss',
})
export class ProductCategory implements OnInit {

   showForm: boolean = false;  // Control the visibility of the form


  categoryForm!: FormGroup;

  isEdit = signal(false);
  selectedId = signal<number | null>(null);

  categoryList = signal<ProductCategoryModel[]>([]);

  constructor(
    private fb: FormBuilder,
    private categoryService: ProdcutCategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategory();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['ACTIVE']
    });
  }

  // 🔥 LOAD CATEGORY (Signal अपडेट)
  loadCategory() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categoryList.set(res);
      },
      error: () => {
        Swal.fire('Error', 'Failed to load category', 'error');
      }
    });
  }

  // 🔥 SUBMIT
  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = this.categoryForm.value;

    if (this.isEdit()) {
    
      this.categoryService.updateCategory(this.selectedId()!, payload).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category updated successfully',
            confirmButtonText: 'Ok'
          });

          

          this.loadCategory();
          this.resetForm();
        },
        error: () => {
          Swal.fire('Error', 'Update failed', 'error');
        }
      });

    } else {

      this.categoryService.addCategory(payload).subscribe({
        next: () => {

          Swal.fire({
  icon: 'success',
  title: 'Saved!',
  text: 'Category added successfully',
  confirmButtonText: 'Ok'
});

          // Form submit logic (e.g., send to API)
      this.showForm = false; // Hide form after submission

          this.loadCategory();
          this.resetForm();
        },
        error: () => {
          Swal.fire('Error', 'Save failed', 'error');
        }
      });

    }
  }

  // 🔥 EDIT
  onEdit(item: ProductCategoryModel) {
    this.isEdit.set(true);
    this.selectedId.set(item.id);

    this.categoryForm.patchValue({
      name: item.name,
      description: item.description,
      status: item.status
    });
       this.showForm = true;  // Show the form when editing
  }

  // 🔥 DELETE (with confirmation)
  onDelete(id: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the category',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

      if (result.isConfirmed) {

        this.categoryService.deleteCategory(id).subscribe({
          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category deleted successfully',
              timer: 1500,
              showConfirmButton: false
            });

            this.loadCategory();
          },
          error: () => {
            Swal.fire('Error', 'Delete failed', 'error');
          }
        });

      }
    });
  }

  // 🔥 RESET
  resetForm() {
    this.categoryForm.reset({ status: 'ACTIVE' });
    this.isEdit.set(false);
    this.selectedId.set(null);
     this.showForm = false;  // Hide the form on reset
  }

}
