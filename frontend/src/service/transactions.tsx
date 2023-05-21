import axios, { AxiosResponse } from 'axios';

const baseURL = 'http://localhost:3000';

interface ICallBack {
  (status: AxiosResponse): void;
}

const axiosInstance = axios.create({ baseURL });
export function getTransactions(callback: ICallBack) {
  axiosInstance
    .get(`${baseURL}/transaction`)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function uploadTransactions(callback: ICallBack, file: File) {
  axiosInstance
    .post(`${baseURL}/transaction`, { body: file })
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
