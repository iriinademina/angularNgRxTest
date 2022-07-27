import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import {
  requestGetProducts,
  requestUpdateProduct,
  requestDeleteProduct,
} from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  allProductsSelector,
  createProductSuccessSelector,
  allProductsToatalItems,
  getProductByIdSelector,
  productsCurrentPage,
  deleteProductSuccessSelector,
} from 'src/app/core/selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { first, filter, map, take, tap } from 'rxjs/operators';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit, OnDestroy {
  id: number;
  listOfProducts$: Observable<Product[]>;
  changedProduct$: Observable<any>;
  apiSuccessSubscription: Subscription;
  apiDelSuccessSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<RootState>
  ) {
    this.listOfProducts$ = this.store$.select(allProductsSelector);
  }

  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe((params) => {
      this.id = +params['id'];
    });

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
          return p;
        } else return productById;
      })
    );
  }

  onSubmit(value: Product) {
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
          this.router.navigate(['/products-list']);
        });
    }
  }

  onDelete(value: boolean) {
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
    if (this.apiSuccessSubscription) {
      this.apiSuccessSubscription.unsubscribe();
    }
  }
}
