import { ICallBack, axiosInstance, baseURL } from '@/helpers/common';

/**
 * Request to fetch all users
 * @param callback function callback
 */
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

/**
 * Request to fetch a user by id
 * @param callback function callback
 */
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
