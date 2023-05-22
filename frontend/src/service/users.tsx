import axios, { AxiosResponse } from 'axios';
import { baseURL } from './transactions';
import { ICallBack } from './transactions';
import { axiosInstance } from './transactions';

export function getAllUsers(callback: ICallBack) {
  axiosInstance
    .get(`${baseURL}/users`)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
