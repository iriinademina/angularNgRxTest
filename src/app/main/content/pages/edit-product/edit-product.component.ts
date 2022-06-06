import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../../../../core/models/product.model';
import {
  requestGetProducts,
  requestUpdateProduct,
  requestDeleteProduct
} from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  isLoadingProductsSelector,
  allProductsSelector,
  createProductSuccessSelector,
  allProductsToatalItems,
  getProductByIdSelector,
  isLoadingProductByIdSelector,
  productsCurrentPage,
  deleteProductSuccessSelector,
} from 'src/app/core/selectors';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  first,
  filter,
  map,
  take,
  tap
} from 'rxjs/operators';
import { Observable, of, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit, OnDestroy {
  //editedProduct: Product;
  id: number;
  listOfProducts$: Observable<Product[]>;
  changedProduct$: Observable<any>;
  currentPage$: Observable<number>;
  productById$: Observable<Product | null>;
  IsLoadingProduct$: Observable<boolean>;

  apiSuccessSubscription: Subscription;
  apiDelSuccessSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<RootState>,
  ) {
    this.listOfProducts$ = this.store$.select(allProductsSelector);
    this.currentPage$ = this.store$.select(productsCurrentPage);
    this.productById$ = this.store$.select(getProductByIdSelector);
    this.IsLoadingProduct$ = this.store$.select(isLoadingProductByIdSelector);
  }

  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe((params) => {
      this.id = +params['id'];
    });
    console.log('onInit current id', this.id);

    this.store$.pipe(select(productsCurrentPage)).subscribe((curPage) => {
      console.log('cur page from init edit', curPage);
    });

    
    this.changedProduct$ = combineLatest([
      this.listOfProducts$,
      this.store$.pipe(select(getProductByIdSelector)),
    ]).pipe(
      map(([products, productById]) => {
        if (products.length !== 0) {
          let p = products.filter((product) => product.id === this.id)[0];
          console.log('product find', p);
          return p;
        } else return productById;
      })
    );
  }

  onSubmit(value: Product) {
    console.log('value edit', value);
    if (value) {
      this.store$.dispatch(
        requestUpdateProduct({ editedProduct: value, id: this.id })
      );

      this.apiSuccessSubscription = this.store$
        .pipe(
          select(createProductSuccessSelector),
          filter((val) => !!val),
          take(1)
        )
        .subscribe((val) => {
          console.log('val data', val);
          this.router.navigate(['/products-list']);
        });
    }
  }

  onDelete(value: boolean) {
    console.log('delete emit', value);
    if (value) {
      this.store$.dispatch(requestDeleteProduct({ id: this.id }));

      this.apiDelSuccessSubscription = combineLatest([
        this.store$.pipe(
          select(deleteProductSuccessSelector),
          filter((val) => !!val),
          take(1)
        ),
        this.store$.pipe(select(allProductsToatalItems)),
        this.store$.pipe(select(productsCurrentPage)),
      ])
        .pipe(
          tap(([message, totalCountProductsItems, currentPage]) => {
            console.log(
              'all pages',
              message,
              totalCountProductsItems,
              currentPage
            );
            this.store$.dispatch(requestGetProducts({ page: currentPage }));
          })
        )
        .subscribe(() => {
          this.router.navigate(['/products-list']);
        });
    }
  }

  ngOnDestroy(): void {
    if (this.apiDelSuccessSubscription) {
      this.apiDelSuccessSubscription.unsubscribe();
    }
    if(this.apiSuccessSubscription) {
      this.apiSuccessSubscription.unsubscribe();
    }
  }
}
