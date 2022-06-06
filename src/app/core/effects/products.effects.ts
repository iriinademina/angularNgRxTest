import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  mergeMap,
  map,
  catchError,
  withLatestFrom,
  switchMap,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../services/products.service';
import { RootState } from '../reducers';
import {
  requestCreateProduct,
  requestCreateProductSuccess,
  requestCreateProductFailure,
  requestGetProducts,
  requestGetProductSuccess,
  requestGetProductFailure,
  requestUpdateProduct,
  requestUpdateProductSuccess,
  requestUpdateProductFailure,
  requestProductById,
  requestProductByIdSuccess,
  requestProductByIdFailure,
  requestDeleteProduct,
  requestDeleteProductSuccess,
  requestDeleteProductFailure
} from '../actions';
import {
  isLoadingProductsSelector,
  allProductsSelector,
} from 'src/app/core/selectors';

import { Product } from '../models/product.model';

@Injectable()
export class ProductsEffects {
  constructor(
    private action$: Actions,
    private productsService: ProductsService,
    private store$: Store<RootState>
  ) {}

  //get
  GetAllProducts$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(requestGetProducts),
      switchMap(({ page }) => {
        return this.productsService.getProducts(page).pipe(
          map((products: Product[]) => {
            return requestGetProductSuccess({ products });
          }),
          catchError((error: Error) => {
            return of(requestGetProductFailure(error));
          })
        );
      })
    )
  );

  // get by id
  GetProductById$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(requestProductById),
      switchMap(({ id }) => {
        return this.productsService.getProductById(id).pipe(
          map((product: Product) => {
           
            return requestProductByIdSuccess({ product });
          }),
          catchError((error: Error) => {
            return of(requestProductByIdFailure(error));
          })
        );
      })
    )
  );


  // update
  UpdateProduct$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(requestUpdateProduct),
      switchMap(({ editedProduct, id}) => {
        console.log('data from update', editedProduct,id);
        return this.productsService.updateProduct(editedProduct, id).pipe(
          map((product: Product) => {
            return requestUpdateProductSuccess({ product });
          }),
          catchError((error: Error) => {
            return of(requestUpdateProductFailure(error));
          })
        );
      })
    )
  );

  //create
  CreateProduct$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(requestCreateProduct),
      switchMap(({ productData }) => {
        console.log('data', productData);
        return this.productsService.createProduct(productData).pipe(
          map((product: Product) => {
            return requestCreateProductSuccess({ product });
          }),
          catchError((error: Error) => {
            return of(requestCreateProductFailure(error));
          })
        );
      })
    )
  );

// delete
DeleteProduct$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(requestDeleteProduct),
  switchMap(({ id }) => {
    console.log('delete id', id);
    return this.productsService.deleteProduct(id).pipe(
      map((message: string) => {
        console.log('message delete success', message)
        return requestDeleteProductSuccess({ message });
      }),
      catchError((error: Error) => {
        return of(requestDeleteProductFailure(error));
      })
    );
  })
)
);
}

