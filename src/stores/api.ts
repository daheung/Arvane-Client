import type {BaseQueryFn} from "@reduxjs/toolkit/query";
import axios, {type AxiosRequestConfig} from "axios";

export type ErrorType = {
    isToast: boolean;
    status: number;
    statusText?: string;
    error?: string;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true
});

export const axiosBaseQuery = (): BaseQueryFn<AxiosRequestConfig> => async (
    config: AxiosRequestConfig
) => {
    try {
        return await api(config);
    } catch (err) {
        console.error('API Error:', err);
        return err;
    }
}
