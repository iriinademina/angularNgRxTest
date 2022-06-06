import { ActionReducerMap} from "@ngrx/store";
import { routerReducer, RouterReducerState } from "@ngrx/router-store";

import * as fromProducts from "./products.reducer";

export interface RootState {
    router: RouterReducerState;
    productReducer: fromProducts.ProductState;
}

export const reducers: ActionReducerMap<RootState> = {
    router: routerReducer,
    productReducer: fromProducts.reducer
}

