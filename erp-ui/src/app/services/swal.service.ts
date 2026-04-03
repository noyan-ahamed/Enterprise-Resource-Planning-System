// src/app/core/swal.service.ts
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // App-wide singleton
})
export class SwalService {

  // 🔥 Global Swal instance (always on top)
  SwalTop = Swal.mixin({
    target: document.body,           // always attach to body
    customClass: {
      popup: 'swal-high-zindex'      // z-index override
    },
    allowOutsideClick: false,
    backdrop: true
  });

  // Optional helper function
  confirmCancel(title = 'Cancel?', text = 'Are you sure?') {
    return this.SwalTop.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Close',
      cancelButtonText: 'Stay'
    });
  }

  success(message: string, title = 'Success') {
    return this.SwalTop.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'OK'
    });
  }

  error(message: string, title = 'Error') {
    return this.SwalTop.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'OK'
    });
  }
}