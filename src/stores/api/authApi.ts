import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "@/stores/api.ts";
import type {LoginModal, SignInModal} from "@/models/UserModel.ts";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    endpoints: build => ({
        login: build.mutation<void, LoginModal>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                data: body
            })
        }),
        signIn: build.mutation<void, SignInModal>({
            query: (body) => ({
                url: '/auth/sign-in',
                method: 'POST',
                data: body
            })
        }),
        isLogin: build.query<boolean, void>({
            query: () => ({
                url: '/auth/isLogin',
                method: 'GET'
            })
        }),
        duplicatedLoginId: build.query<boolean, string>({
            query: (id: string) => ({
                url: '/auth/exists/' + id,
                method: 'GET',
            })
        })
    })
});

export const {
    useLoginMutation,
    useIsLoginQuery,
    useSignInMutation,
    useLazyDuplicatedLoginIdQuery,
} = authApi;