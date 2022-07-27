import { createAction, props } from '@ngrx/store';
import {
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductsTotalCountItems,
  getCurrentPageOfProducts,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  getProductRequest,
  getProductSuccess,
  getProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
} from '../types';
import { Product } from '../models/product.model';
//get

export const requestGetProducts: any = createAction(
  getProductsRequest,
  props<{ page: number }>()
);
export const requestGetProductSuccess: any = createAction(
  getProductsSuccess,
  props<{ products: Product[] }>()
);
export const requestGetProductFailure: any = createAction(
  getProductsFailure,
  props<{ error: Error }>()
);
export const requestProductsTotalCountItems: any = createAction(
  getProductsTotalCountItems,
  props<{ totalItems: number }>()
);
export const requestCurrentPageOfProducts: any = createAction(
  getCurrentPageOfProducts,
  props<{ currentPage: number }>()
);

// get by id
export const requestProductById: any = createAction(
  getProductRequest,
  props<{ id: number }>()
);
export const requestProductByIdSuccess: any = createAction(
  getProductSuccess,
  props<{ product: Product }>()
);
export const requestProductByIdFailure: any = createAction(
  getProductFailure,
  props<{ error: Error }>()
);

// create
export const requestCreateProduct: any = createAction(
  createProductRequest,
  props<{ productData: Product }>()
);
export const requestCreateProductSuccess: any = createAction(
  createProductSuccess,
  props<{ product: Product }>()
);
export const requestCreateProductFailure: any = createAction(
  createProductFailure,
  props<{ error: Error }>()
);

// update
export const requestUpdateProduct: any = createAction(
  updateProductRequest,
  props<{ editedProduct: Product; id: number }>()
);
export const requestUpdateProductSuccess: any = createAction(
  updateProductSuccess,
  props<{ product: Product }>()
);
export const requestUpdateProductFailure: any = createAction(
  updateProductFailure,
  props<{ error: Error }>()
);

// delete

export const requestDeleteProduct: any = createAction(
  deleteProductRequest,
  props<{ id: number }>()
);
export const requestDeleteProductSuccess: any = createAction(
  deleteProductSuccess,
  props<{ message: any }>()
);
export const requestDeleteProductFailure: any = createAction(
  deleteProductFailure,
  props<{ error: Error }>()
);
