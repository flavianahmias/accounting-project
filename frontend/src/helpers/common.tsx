import axios, { AxiosResponse } from 'axios';

export const numberToBrazilCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format;

export const baseURL = 'http://localhost:3000';

export interface ICallBack {
  (status: AxiosResponse): void;
}

export const axiosInstance = axios.create({ baseURL });
