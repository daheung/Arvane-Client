import {combineReducers, configureStore, type SliceSelectors} from "@reduxjs/toolkit";
import {authApi} from "@/stores/api/authApi.ts";
import {userApi} from "@/stores/api/userApi.ts";

const reducer = {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
}

const store = configureStore({
    reducer: combineReducers<typeof reducer>(reducer),
    middleware: getMiddleware => {
        return getMiddleware().concat([
            authApi.middleware,
            userApi.middleware,
        ])
    }
});

export type ReducerType = keyof typeof reducer;
export type SelectorType = SliceSelectors<typeof reducer>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
