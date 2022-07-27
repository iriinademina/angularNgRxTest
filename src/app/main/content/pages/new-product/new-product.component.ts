import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  requestCreateProduct,
  requestGetProducts,
  requestProductsTotalCountItems,
} from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  createProductSuccessSelector,
  allProductsToatalItems,
  productsCurrentPage,
} from 'src/app/core/selectors';
import { Subscription, zip, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  apiSuccessSubscription: Subscription;

  constructor(
    private store$: Store<RootState>,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.productForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.store$.dispatch(
      requestCreateProduct({ productData: this.productForm.value })
    );

    this.apiSuccessSubscription = combineLatest([
      this.store$.pipe(
        select(createProductSuccessSelector),
        filter((val) => !!val),
        take(1)
      ),
      this.store$.pipe(select(allProductsToatalItems)),
      this.store$.pipe(select(productsCurrentPage)),
    ])
      .pipe(
        map(([createProduct, totalCountProductsItems, currentPage]) => {
          this.store$.dispatch(requestGetProducts({ page: currentPage }));
          let allPages = this.productService.getTotalPages(
            totalCountProductsItems
          );
          this.store$.dispatch(
            requestProductsTotalCountItems({ totalItems: allPages })
          );
          return allPages;
        })
      )
      .subscribe((count: any) => {
        this.router.navigate(['/products-list']);
      });
  }

  ngOnDestroy(): void {
    if (this.apiSuccessSubscription) {
      this.apiSuccessSubscription.unsubscribe();
    }
  }
}
