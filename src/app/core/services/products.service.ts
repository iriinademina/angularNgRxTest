import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { requestProductsTotalCountItems } from 'src/app/core/actions';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/core/reducers';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private endpoint_products: string;
  private limit_pagination_items: number;

  constructor(private http: HttpClient, private store$: Store<RootState>) {
    this.endpoint_products = 'http://localhost:3000/products';
    this.limit_pagination_items = 2;
  }

  getProducts(page: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        `${this.endpoint_products}?_page=${page}&_limit=${this.limit_pagination_items}`,
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((response) => {
          console.log('total count', response.headers.get('X-Total-Count'));
          let totalCountItems = Number(response.headers.get('X-Total-Count'));
          this.store$.dispatch(
            requestProductsTotalCountItems({ totalItems: totalCountItems })
          );
          this.setCurrentPageOnStore(page);
        }),
        map((response: any) => {
          return response.body;
        }),
        catchError((error: Error) => {
          return throwError(error);
        })
      );
  }

  parseLinkHeader(linkHeader: any) {
    const linkHeadersArray = linkHeader
      .split(', ')
      .map((header: any) => header.split('; '));
    const linkHeadersMap = linkHeadersArray.map((header: any) => {
      const thisHeaderRel = header[1].replace(/"/g, '').replace('rel=', '');
      const thisHeaderUrl = header[0].slice(1, -1);
      return [thisHeaderRel, thisHeaderUrl];
    });
    return Object.fromEntries(linkHeadersMap);
  }

  getProductById(id: number): Observable<Product> {
    const currentPage = this.getCurrentPageOnStore();
    return this.http
      .get<Product[]>(`${this.endpoint_products}/${id}`, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          console.log('current page from id', currentPage);
        }),
        map((response: any) => {
          return response.body;
        }),
        catchError((error: Error) => {
          return throwError(error);
        })
      );
  }

  setCurrentPageOnStore(page: number) {
    localStorage.setItem('page', JSON.stringify(page));
  }

  getCurrentPageOnStore(): string | null {
    try {
      return localStorage.getItem('page');
    } catch (err) {
      return null;
    }
  }

  getTotalPages(count: number): number {
    return Math.ceil(count / this.limit_pagination_items);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.endpoint_products, product);
  }

  updateProduct(product: Product, id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint_products}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http
      .delete(`${this.endpoint_products}/${id}`)
      .pipe(map((data) => ({ message: 'Product successfully deleted' })));
  }
}
