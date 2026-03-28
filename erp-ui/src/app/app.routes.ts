import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ProductCategory } from './components/product-category/product-category';
import { SuppliersComponent } from './components/suppliers/suppliers.component/suppliers.component';
import { PurchaseOrderComponent } from './components/purchase/purchase-order.component/purchase-order.component';
import { Products } from './components/products/products';

export const routes: Routes = [
    {
        path:'',
        redirectTo:"admin-layout",
        pathMatch:"full"
    },
    {
        path:'admin-layout',
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
            }
        ]
    }
];
