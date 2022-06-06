import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EditProductComponent } from './edit-product.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { ProductsResolverService } from '../../../../core/services/edit-product.resolver.service';

const routes: Routes = [
  {
    path: '',
    component: EditProductComponent
  },
  {
    path: ':id',
    component: EditProductComponent,
    resolve: [ProductsResolverService]
  }
];


@NgModule({
  declarations: [
    EditProductComponent,
    EditProductFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class EditProductModule { }
