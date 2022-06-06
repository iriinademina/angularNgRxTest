import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'products-list',
    loadChildren: () => import('./main/content/pages/products-list/products-list.module').then(module => module.ProductsListModule ),
    
  },
  { path: 'new-product',
    loadChildren: () => import('./main/content/pages/new-product/new-product.module').then(module => module.NewProductModule ),
    
  },
  { path: 'edit-product',
    loadChildren: () => import('./main/content/pages/edit-product/edit-product.module').then(module => module.EditProductModule),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
