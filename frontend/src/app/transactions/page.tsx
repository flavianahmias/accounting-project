'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.scss';

import {
  getTransactions,
  getTransactionsById,
  uploadTransactions,
} from '@/service/transactions';
import SvgFile from '../../assets/file-solid.svg';
import SvgFileUpdated from '../../assets/file-circle-check-solid.svg';
import { ITransaction } from '@/helpers/interfaces';
import { numberToBrazilCurrency } from '@/helpers/common';
import Loading from '@/components/loading';

export default function Home() {
  const [TransactionsList, setTransactionsList] = useState<ITransaction[]>([]);
  const [transactionSelected, setTransactionsSelected] =
    useState<ITransaction>();

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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
  const foundTransactionById = (id: number) => {
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
    setLoading(true);
    if (!file) {
      return;
    }

    uploadTransactions(file, (response) => {
      try {
        if (response.status === 201) {
          setLoading(false);
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
      <Sidebar />
      <Container>
        {loading && (
          <>
            <div className="loading">
              <Loading />
            </div>
            <div className="over"></div>
          </>
        )}
        <div className="transactions__container">
          <div className="forms">
            <div className="drop">
              <label htmlFor="update-file">
                {fileName !== '' ? (
                  <div className="updateFileSVG">
                    <SvgFileUpdated className="fileSVG" />
                    {fileName}
                  </div>
                ) : (
                  <div className="updateFileSVG">
                    <SvgFile className="fileSVG" />
                    Clique aqui para inserir seu arquivo
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="input"
                id="update-file"
                key={inputKey}
              />
            </div>
            <button
              onClick={handleUploadClick}
              className={`upload ${!fileName && 'disabled'}`}
              disabled={!fileName}
            >
              Upload
            </button>
          </div>

          <div className="transactions">
            <section className="table">
              <div className="transactions__list">
                {TransactionsList.length > 0 ? (
                  <>
                    <p>Total de transações: {TransactionsList.length}</p>
                    {TransactionsList.map((transaction, index) => {
                      return (
                        <p
                          className="transaction"
                          key={transaction.id}
                          onClick={() => foundTransactionById(transaction.id)}
                        >
                          {index + 1} - {transaction.product}
                          {'  '}
                          <span
                            className={`transaction--type${transaction.type}`}
                          >
                            {checkTransatctionType(transaction.type)}
                          </span>
                        </p>
                      );
                    })}
                  </>
                ) : (
                  <div className="visualization--noTransaction">
                    <p>Nenhuma transação encontrada.</p>
                    <p>Faça o upload do seu arquivo.</p>
                  </div>
                )}
              </div>
            </section>
            <section className="visualization">
              {transactionSelected ? (
                <div className="visualization--transaction">
                  <p className="transaction--product">
                    {transactionSelected.product}
                  </p>
                  <p className="transaction--value">
                    Valor: {numberToBrazilCurrency(transactionSelected.value)}
                    <span
                      className={`transaction--type${transactionSelected.type}`}
                    >
                      {checkTransatctionType(transactionSelected.type)}
                    </span>
                  </p>
                  <p className="transaction--date">
                    Data:
                    <span>
                      {new Date(transactionSelected.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="transaction--sellerName">
                    Vendedor: {transactionSelected.seller.name}
                  </p>
                  <p className="transaction--affiliated">
                    {transactionSelected.seller.role === 1
                      ? `Afiliado de: ${transactionSelected.seller.creator.name}`
                      : ''}
                  </p>
                </div>
              ) : (
                <p className="visualization--noData">
                  Selecione uma transação para ver mais detalhes
                </p>
              )}
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
