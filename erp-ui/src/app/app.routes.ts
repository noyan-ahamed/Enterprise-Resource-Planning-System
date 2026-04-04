import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ProductCategory } from './components/product-category/product-category';
import { SuppliersComponent } from './components/suppliers/suppliers.component/suppliers.component';
import { PurchaseOrderComponent } from './components/purchase/purchase-order.component/purchase-order.component';
import { Products } from './components/products/products';
import { SupplierLedgerComponent } from './components/supplier-ledger/supplier-ledger.component/supplier-ledger.component';
import { SupplierLedgerDetailsComponent } from './components/supplier-ledger/supplier-ledger-details.component/supplier-ledger-details.component';
import { EmployeeLayout } from './layouts/employee-layout/employee-layout';
import { CustomerComponent } from './components/customer/customer.component/customer.component';
import { NewSaleEntryComponent } from './components/employee-sales/new-sale-entry.component/new-sale-entry.component';
import { SalesHistoryComponent } from './components/employee-sales/sales-history.component/sales-history.component';
import { CustomerLedgerComponent } from './components/customer-ledger/customer-ledger.component/customer-ledger.component';
import { CustomerLedgerDetailsComponent } from './components/customer-ledger/customer-ledger-details.component/customer-ledger-details.component';
import { CustomerDueCollectionComponent } from './components/customer-due-collection.component/customer-due-collection.component';
import { ApprovedPaymentComponent } from './components/approved-payment.component/approved-payment.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component/admin-dashboard.component';

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
            path: '',
            redirectTo: 'admin-dashboard',
            pathMatch: 'full'
        },
        {
            path: 'admin-dashboard',
            component: AdminDashboardComponent
        },
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
            },
            {
                path: 'customer.component',
                component: CustomerComponent
            },
            // Customer Ledger Summary Page
            {
                path: 'customer-ledger',
                component: CustomerLedgerComponent
            },

            // Customer Ledger Details Page
            {
                path: 'app-customer-ledger-details/:id',
                component: CustomerLedgerDetailsComponent
            },
            {
                path: 'approved-payment',
                component: ApprovedPaymentComponent
            }
        ]
    },
    {
        path: 'employee-layout',
        component: EmployeeLayout,
        children: [
            {
                path: '',
                redirectTo: 'new-sale-entry',
                pathMatch: 'full'
            },
            {
                path: 'new-sale-entry',
                component: NewSaleEntryComponent
            },
            {
                path: 'sales-history',
                component: SalesHistoryComponent
            },
            {
                path: 'customer-due-collection',
                component: CustomerDueCollectionComponent
            }
        ]
    }
];
