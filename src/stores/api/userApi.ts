import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "@/stores/api.ts";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery(),
    endpoints: build => ({
        existsLoginId: build.query<boolean, string>({
            query: (loginId: string) => ({
                url: '/auth/exists/' + loginId,
                method: 'GET',
            })
        })
    })
});

export const {
    useLazyExistsLoginIdQuery,
} = userApi;