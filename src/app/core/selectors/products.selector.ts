import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../reducers/products.reducer';

export const productFeatureSelector =
  createFeatureSelector<ProductState>('productReducer');

//get
export const isLoadingProductsSelector = createSelector(
  productFeatureSelector,
  ({ isLoadingProducts }: ProductState) => isLoadingProducts
);

export const allProductsSelector = createSelector(
  productFeatureSelector,
  ({ allProducts }: ProductState) => allProducts
);

export const allProductsToatalItems = createSelector(
  productFeatureSelector,
  ({ totalCountProductsItems }: ProductState) => totalCountProductsItems
);
export const productsCurrentPage = createSelector(
  productFeatureSelector,
  ({ currentPage }: ProductState) => currentPage
);

// create
export const isLoadingCreateProduct = createSelector(
  productFeatureSelector,
  ({ isLoadingCreateProduct }: ProductState) => isLoadingCreateProduct
);

export const createProductErrorSelector = createSelector(
  productFeatureSelector,
  ({ createProductError }: ProductState) => createProductError
);

export const createProductSuccessSelector = createSelector(
  productFeatureSelector,
  ({ createProduct }: ProductState) => createProduct
);

// get by id
export const getProductByIdSelector = createSelector(
  productFeatureSelector,
  ({ productById }: ProductState) => productById
);

export const isLoadingProductByIdSelector = createSelector(
  productFeatureSelector,
  ({ isLoadingProductById }: ProductState) => isLoadingProductById
);

// delete
export const deleteProductSuccessSelector = createSelector(
  productFeatureSelector,
  ({ delProductMsg }: ProductState) => delProductMsg
);
