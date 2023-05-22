import { ICallBack, axiosInstance, baseURL } from '@/helpers/common';

/**
 * Request to fetch all transactions
 * @param callback function callback
 */
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

/**
 * Request to create new transactions based on the file
 * @param callback function callback
 */
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

/**
 * Request to fetch a transaction by ID
 * @param callback function callback
 */
export function getTransactionsById(id: number, callback: ICallBack) {
  axiosInstance
    .get(`${baseURL}/transaction/${id}`, {})
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
