import axios, { AxiosResponse } from 'axios';
import { baseURL } from './transactions';
import { ICallBack } from './transactions';
import { axiosInstance } from './transactions';

export function getUsers(callback: ICallBack) {
  axiosInstance
    .get(`${baseURL}/user`)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}