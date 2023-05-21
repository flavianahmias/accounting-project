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
export function uploadTransactions(file: File, callback: ICallBack) {
  let formData = new FormData();
  formData.append('file', file);
  axiosInstance
    .post(`${baseURL}/transaction/upload`, formData, {
      headers: {
        'content-type': `multipart/form-data`,
      },
    })
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
