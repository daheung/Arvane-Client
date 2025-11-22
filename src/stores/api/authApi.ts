import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "@/stores/api.ts";
import type {LoginModal} from "@/models/UserModel.ts";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    endpoints: build => ({
        login: build.mutation<LoginModal, void>({
            query: () => ({
                url: '/auth/login',
                method: 'POST',
            })
        })
    })
});

export const {
    useLoginMutation
} = authApi;