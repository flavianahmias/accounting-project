'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import './page.scss';

import {
  getTransactions,
  getTransactionsById,
  uploadTransactions,
} from '@/service/transactions';
import SvgFile from '../../assets/file-solid.svg';
import SvgHand from '../../assets/hand-pointer-solid.svg';
import SvgFileUpdated from '../../assets/file-circle-check-solid.svg';
import { ITransaction } from '@/helpers/interfaces';
import { numberToBrazilCurrency } from '@/helpers/common';
import { Loading } from '@/components/loading';

export default function Transactions() {
  const [TransactionsList, setTransactionsList] = useState<ITransaction[]>([]);
  const [transactionSelected, setTransactionsSelected] =
    useState<ITransaction>();

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');
  const [horizontalLoading, setHorizontalLoading] = useState<boolean>(false);
  const [circleLoading, setCicleLoading] = useState<boolean>(true);
  const [inputKey, setInputKey] = useState<number>(0);

  /**
   * This function requests a complete listing of all transactions.
   */
  const getAlTransactions = useCallback(() => {
    getTransactions((response) => {
      try {
        if (response.status === 200) {
          setTransactionsList(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setCicleLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    getAlTransactions();
  }, []);

  /**
   * This function searches for the transaction that was selected using the ID.
   * @param id transaction identifier
   */
  const findTransactionById = (id: number) => {
    getTransactionsById(id, (response) => {
      try {
        if (response.status === 200) {
          setTransactionsSelected(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  /**
   * This function receives the uploaded file and checks if it is the correct type.
   * @param e File upload in input
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0].type !== 'text/plain') {
        alert('Por favor insira um arquivo do tipo txt.');
      } else {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
      }
    }
  };

  /**
   * This function checks if there is a file to send to the server,
   * if it exists, it makes the transaction creation request.
   * After that, Updates the list of displayed transactions
   * @returns
   */
  const handleUploadClick = () => {
    setHorizontalLoading(true);
    if (!file) {
      return;
    }

    uploadTransactions(file, (response) => {
      try {
        if (response.status === 201) {
          setHorizontalLoading(false);
          getAlTransactions();
          setInputKey((l) => l + 1);
          setFileName('');
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  /**
   * This function checks according to the type received in the file
   *  which is the category of the transition
   * @param type transition type
   * @returns Transaction type in full
   */
  const checkTransatctionType = (type: number) => {
    switch (type) {
      case 1:
        return 'Venda criador';
      case 2:
        return 'Venda afiliado';
      case 3:
        return 'Comissão paga';
      case 4:
        return 'Comissão recebida';
      default:
        break;
    }
  };

  return (
    <div className="home">
      <title>Transações</title>
      {horizontalLoading && <Loading loadingType={'horizontal'} />}
      <div className="container">
        <div className="header">
          <h1>Transações</h1>
          <div className="forms">
            <div className="drop">
              <label htmlFor="update-file">
                {fileName !== '' ? (
                  <div className="updateFileSVG">
                    <SvgFileUpdated className="fileSVG" />
                    <span>{fileName}</span>
                  </div>
                ) : (
                  <div className="updateFileSVG">
                    <SvgFile className="fileSVG" />
                    <span>Clique aqui para inserir seu arquivo</span>
                  </div>
                )}
              </label>
              <input
                hidden
                type="file"
                onChange={handleFileChange}
                className="input"
                id="update-file"
                key={inputKey}
              />
            </div>
            <button
              onClick={handleUploadClick}
              className={
                'upload ' + (TransactionsList.length == 0 ? 'attention' : '')
              }
              disabled={!fileName}
            >
              Upload
            </button>
          </div>
        </div>

        <div className="transactions">
          <section className="table">
            <div className="header">
              <p>
                Total de transações: <em>{TransactionsList.length}</em>
              </p>
            </div>
            <div className="transactions__list">
              {circleLoading ? (
                <Loading loadingType={'circle'} />
              ) : (
                <>
                  {TransactionsList.length > 0 ? (
                    <>
                      {TransactionsList.map((transaction, index) => {
                        return (
                          <p
                            className={
                              'transaction ' +
                              (transactionSelected?.id === transaction.id
                                ? 'selected'
                                : '')
                            }
                            key={transaction.id}
                            onClick={() => findTransactionById(transaction.id)}
                          >
                            {index + 1} - {transaction.product}
                            <span className={`type${transaction.type}`}>
                              {checkTransatctionType(transaction.type)}
                            </span>
                          </p>
                        );
                      })}
                    </>
                  ) : (
                    <div className="noTransaction">
                      <p>Nenhuma transação encontrada.</p>
                      <p>Faça o upload do seu arquivo.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
          <section className="visualization">
            {transactionSelected ? (
              <div className="visualization__transaction">
                <p className="product">
                  <span>{transactionSelected.product}</span>
                  <span className={`tag type${transactionSelected.type}`}>
                    {checkTransatctionType(transactionSelected.type)}
                  </span>
                </p>

                <p className="value">
                  <span>Valor</span>
                  <span>
                    {numberToBrazilCurrency(transactionSelected.value)}
                  </span>
                </p>
                <p className="date">
                  <span>Data</span>
                  <span>
                    {new Date(transactionSelected.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="sellerName">
                  <span>Vendedor</span>
                  <span>{transactionSelected.seller.name}</span>
                </p>
                {transactionSelected.seller.role === 1 ? (
                  <p className="affiliated">
                    <span>Afiliado de</span>
                    <span>{transactionSelected.seller.creator.name}</span>
                  </p>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <p className="no__data">
                <SvgHand />
                <span>Selecione uma transação para ver mais detalhes</span>
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
