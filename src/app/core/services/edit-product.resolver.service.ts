import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from '../models/product.model';
import { requestProductById } from 'src/app/core/actions';

import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  allProductsSelector,
  getProductByIdSelector,
} from 'src/app/core/selectors';

@Injectable({ providedIn: 'root' })
export class ProductsResolverService implements Resolve<Product[]> {
  constructor(private store$: Store<RootState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store$.select(allProductsSelector).pipe(
      take(1),
      map((products) => {
        return products;
      }),
      switchMap((products) => {
        if (products.length === 0) {
          this.store$.dispatch(requestProductById({ id: route.params['id'] }));
          return this.store$.pipe(
            select(getProductByIdSelector),
            filter((val) => !!val),
            take(1),
            map((p) => {
              return p;
            })
          );
        } else {
          return of(products);
        }
      })
    );
  }
}
