import { Action, createReducer, on } from "@ngrx/store";

import {
    requestCreateProduct,
    requestCreateProductSuccess,
    requestCreateProductFailure,
    requestGetProducts,
    requestGetProductSuccess,
    requestGetProductFailure,
    requestProductsTotalCountItems,
    requestCurrentPageOfProducts,
    requestUpdateProduct,
    requestUpdateProductSuccess,
    requestUpdateProductFailure,
    requestProductById,
    requestProductByIdSuccess,
    requestProductByIdFailure,
    requestDeleteProduct,
    requestDeleteProductSuccess,
    requestDeleteProductFailure
} from '../actions'

import { Product } from '../models/product.model';

export interface ProductState {
    allProducts: Product[];
    allProductsError: Error | null;
    isLoadingProducts: boolean;
  
    createProduct: Product | null;
    createProductError: Error | null;
    isLoadingCreateProduct: boolean;

    productById: Product | any,
    productByIdError: null,
    isLoadingProductById: boolean,

    totalCountProductsItems: number;
    currentPage: number;

    delProductMsg: string | null;
    isDelProductMsgLoading: boolean;
    errorDelProductMsg: Error | null;
  
  }

const initialState: ProductState = {
    allProducts: [] ,
    allProductsError: null,
    isLoadingProducts: false,
  
    createProduct: null,
    createProductError: null,
    isLoadingCreateProduct: false,

    productById: null,
    productByIdError: null,
    isLoadingProductById: false,

    totalCountProductsItems: 0,
    currentPage: 1,

    delProductMsg: null,
    isDelProductMsgLoading: false,
    errorDelProductMsg: null

  };

  const productReducer = createReducer(
    initialState,
    //all
    on(requestGetProducts, state => {
      return {
        ...state,
        isLoadingProducts: true,
        allProductsError: null
      };
    }),
    on(requestGetProductSuccess, (state, { products }) => {
      return {
        ...state,
        allProducts: products,
        isLoadingCreateProduct: false,
        createProductError: null
      };
    }),
    on(requestGetProductFailure, (state, { error }) => {
      return {
        ...state,
        allProducts: [],
        isLoadingProducts: false,
        allProductsError: error
      };
    }),
    on(requestProductsTotalCountItems, (state, { totalItems }) => {
      return {
        ...state,
        totalCountProductsItems: totalItems
      };
    }),
    
    on(requestCurrentPageOfProducts, (state, { currentPage }) => {
      return {
        ...state,
        currentPage: currentPage
      };
    }),
    
   // get by id
    on(requestProductById, state => {
      return {
        ...state,
        isLoadingProductById: true,
        productByIdError: null
      };
    }),
    on(requestProductByIdSuccess, (state, { product }) => {
      
      return {
        ...state,
        productById: product,
        isLoadingProductById: false,
        productByIdError: null
      };
    }),
    on(requestProductByIdFailure, (state, { error }) => {
      return {
        ...state,
        productById: null,
        isLoadingProductById: false,
        productByIdError: error
      };
    }),
    
    // create
    on(requestCreateProduct, state => {
        return {
          ...state,
          isLoadingCreateProduct: true,
          createProductError: null
        };
      }),
      on(requestCreateProductSuccess, (state, { product }) => {
        return {
          ...state,
         // allProducts: [...state.allProducts, product],
          createProduct: product,
          isLoadingCreateProduct: false,
          createProductError: null,
          
        };
      }),
      on(requestCreateProductFailure, (state, { error }) => {
        return {
          ...state,
          createProduct: null,
          isLoadingCreateProduct: false,
          createProductError: error
        };
      }),

    //update
    on(requestUpdateProduct, state => {
      return {
        ...state,
        isLoadingCreateProduct: true,
        createProductError: null
      };
    }),
    on(requestUpdateProductSuccess, (state, { product }) => {

      const { id } = product;
      const ind: number = [...state.allProducts].findIndex((p) =>p.id === id);
      console.log('ind', ind)
      const updatedProduct = {
        ...state.allProducts[ind],
        ...product
      };

      const updatedProducts = [...state.allProducts];
      updatedProducts[ind] = updatedProduct;

      return {
        ...state,
        createProduct: product,
        isLoadingCreateProduct: false,
        allProducts: updatedProducts,
        createProductError: null
      };
    }),
    on(requestUpdateProductFailure, (state, { error }) => {
      return {
        ...state,
        createProduct: null,
        isLoadingCreateProduct: false,
        createProductError: error
      };
    }),
   // delete
    on(requestDeleteProduct, (state) => {
      return {
        ...state,
        delProductMsg: null,
        isDelProductMsgLoading: true,
      };
    }),
    on(requestDeleteProductSuccess, (state, { message }) => {
      return {
        ...state,
        delProductMsg: message,
        isDelProductMsgLoading: false,
      };
    }),
    on(requestDeleteProductFailure, (state, { error }) => {
      return {
        ...state,
        isDelProductMsgLoading: false,
        errorDelProductMsg: error
      };
    }),


  )

  export function reducer(state: ProductState | undefined, action: Action) {
    return productReducer(state, action);
  }