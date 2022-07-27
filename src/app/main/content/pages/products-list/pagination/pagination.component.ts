import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  requestGetProducts,
  requestCurrentPageOfProducts,
} from 'src/app/core/actions';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';
import { productsCurrentPage } from 'src/app/core/selectors';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() itemsPerPage: number;
  @Input() itemsNumber: number;
  @Input() allPagesCount: number;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  private _currentPage: number;
  constructor(private store$: Store<RootState>) {}

  ngOnInit(): void {
    this.store$.select(productsCurrentPage).subscribe((page) => {
      this._currentPage = page;
    });
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page) {
    this._currentPage = page;
    this.store$.dispatch(requestCurrentPageOfProducts({ currentPage: page }));
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
    this.getProducts();
  }

  onPreviousPage(): void {
    this.currentPage -= 1;
    this.getProducts();
  }

  getProducts() {
    this.store$.dispatch(requestGetProducts({ page: this.currentPage }));
  }
}
