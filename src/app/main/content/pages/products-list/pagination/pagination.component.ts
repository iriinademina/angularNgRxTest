import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../../core/models/product.model';
import {
  requestGetProducts,
  requestCurrentPageOfProducts
} from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import {
  productsCurrentPage
} from 'src/app/core/selectors';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() itemsPerPage: number;
  @Input() itemsNumber: number;
  @Input() allPagesCount: number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  private _currentPage: number;
  constructor( private store$: Store<RootState>, private productService: ProductsService ) { }

  ngOnInit(): void {
   this.store$.select(productsCurrentPage).subscribe( page => {
    let pageAfterReload = Number(this.productService.getCurrentPageOnStore());
      this._currentPage = page;
  }
   );
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page) {
    this._currentPage = page;
    this.store$.dispatch(requestCurrentPageOfProducts({ currentPage: page}));
  }

  onSetPage(event: any): void {
    this.currentPage = event.target.value;
  }

  onFirstPage(): void {
    this.currentPage = 1;
    this.getProducts();
  }

  onLastPage(): void {
    this.currentPage = this.allPagesCount;
    this.getProducts();
  }

  onNextPage(): void {
    this.currentPage += 1;
    console.log(this.currentPage);
    this.getProducts();
  }

  onPreviousPage(): void {
    this.currentPage -= 1;
    this.getProducts();
  }

  getProducts() {
    this.store$.dispatch(requestGetProducts({ page: this.currentPage}));
  }

}
