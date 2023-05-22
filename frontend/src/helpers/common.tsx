import axios, { AxiosResponse } from 'axios';

/**
 * This function formats the value for Brazilian currency(REAL)
 */
export const numberToBrazilCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format;

/**
 * The base url to use in requests.
 */
export const baseURL = 'http://localhost:3000';

/**
 * Callback interface to handle requests responses
 */
export interface ICallBack {
  (status: AxiosResponse): void;
}

/**
 * Axios instance to create the connection
 */
export const axiosInstance = axios.create({ baseURL });
