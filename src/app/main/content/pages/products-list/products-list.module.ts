import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component'
import { Routes, RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { PaginationComponent } from './pagination/pagination.component'

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
  },
   
  ]


@NgModule({
  declarations: [ ProductsListComponent, ProductItemComponent, PaginationComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsListModule { }
