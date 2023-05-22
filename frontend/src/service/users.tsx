import { ICallBack, axiosInstance, baseURL } from '@/helpers/common';

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

export function getUserById(id: number, callback: ICallBack) {
  axiosInstance
    .get(`${baseURL}/user/${id}`)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
