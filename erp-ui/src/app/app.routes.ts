import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ProductCategory } from './components/product-category/product-category';
import { SuppliersComponent } from './components/suppliers/suppliers.component/suppliers.component';
import { PurchaseOrderComponent } from './components/purchase/purchase-order.component/purchase-order.component';
import { Products } from './components/products/products';
import { SupplierLedgerComponent } from './components/supplier-ledger/supplier-ledger.component/supplier-ledger.component';
import { SupplierLedgerDetailsComponent } from './components/supplier-ledger/supplier-ledger-details.component/supplier-ledger-details.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "admin-layout",
        pathMatch: "full"
    },
    {
        path: 'admin-layout',
        component: AdminLayout,
        children: [
            {
                path: 'product-category',
                component: ProductCategory
            },
            {
                path: 'suppliers.component',
                component: SuppliersComponent
            },
            {
                path: 'purchase-order.component',
                component: PurchaseOrderComponent
            },
            {
                path: 'products',
                component: Products
            },
            // Supplier Ledger Summary Page
            {
                path: 'supplier-ledger',
                component: SupplierLedgerComponent
            },

            // Supplier Ledger Details Page
            {
                path: 'app-supplier-ledger-details/:id',
                component: SupplierLedgerDetailsComponent
            }
        ]
    }
];
