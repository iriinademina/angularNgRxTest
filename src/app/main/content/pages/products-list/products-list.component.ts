import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import {
  requestGetProducts,
  requestGetProductSuccess,
  requestGetProductFailure,
  requestCurrentPageOfProducts
} from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  isLoadingProductsSelector,
  allProductsSelector,
  createProductSuccessSelector,
  allProductsToatalItems,
  productsCurrentPage
} from 'src/app/core/selectors';
import {
  of,
  Observable,
  Subscription,
} from 'rxjs';
import {
  first,
  tap,
  switchMap,
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  product$: Observable<Product>;
  allPages: number;
  currentPage$ : Observable<number>;
  currentPage: number;
  subscription: Subscription;
  subCurrentPage: Subscription

  constructor(private store$: Store<RootState>, private productsService: ProductsService ) {
  }

  ngOnInit() {
   this.subscription = this.store$.pipe(select(allProductsToatalItems)).subscribe((count) => {
    this.allPages = this.productsService.getTotalPages(count);
    }
  );
  this.subCurrentPage = this.store$.pipe(select(productsCurrentPage)).subscribe((page) => {
    this.currentPage = page
    }
  );

    this.products$ = this.store$.pipe(
      select(allProductsSelector),
      switchMap((products, error) => {
        console.log('products from store', products);
        if (products.length === 0) {
          if(error) {
            console.log('error', error);
            return of([]);
          }
          this.getProducts();
          console.log('products if', products.length);
          return this.store$.pipe(select(allProductsSelector));
        } else {
          return of(products);
        }
      })
    );
  }

  getProducts() {
    let pageAfterReload = Number(this.productsService.getCurrentPageOnStore());
    if(this.currentPage !== pageAfterReload) {
     this.store$.dispatch(requestGetProducts({ page :  pageAfterReload}));
     this.store$.dispatch(requestCurrentPageOfProducts({ currentPage: pageAfterReload}));
    } else {
      this.store$.dispatch(requestGetProducts({ page : 1}));
    }
  }

  //pagination
  onPageChange(page: number = 1): void {
    console.log('emit page', page);
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}
