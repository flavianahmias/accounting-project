'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

import {
  getTransactions,
  getTransactionsById,
  uploadTransactions,
} from '@/service/transactions';
import Loading from '@/components/loading';
import SvgFile from '../assets/file-solid.svg';
import SvgFileUpdated from '../assets/file-circle-check-solid.svg';

interface IUser {
  id: number;
  name: string;
  role: number;
  balance: number;
  creator?: IUser;
}

interface ITransaction {
  id: number;
  type: number;
  product: string;
  date: string;
  value: number;
  seller: IUser;
}

export default function Home() {
  const [TransactionsList, setTransactionsList] = useState<ITransaction[]>([]);
  const [transactionSelected, setTransactionsSelected] =
    useState<ITransaction>();

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');

  let loadingFile = false;

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    loadingFile = true;
    uploadTransactions(file, (response) => {
      try {
        if (response.status === 200) {
          getAlTransactions();
          loadingFile = false;
        }
      } catch (error) {}
    });
  };

  const parseBrazilNumber = (str: string) =>
    parseFloat(str.replace(' ', '').replace('.', '').replace(',', '.'));

  const numberToBrazilCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format;

  return (
    <div className="home">
      <title>Transações</title>
      <Sidebar />
      <Container>
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
                    Insira seu arquivo
                  </div>
                )}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="input"
                id="update-file"
              />
            </div>
            <button
              onClick={handleUploadClick}
              className="upload"
              disabled={!file}
            >
              Upload
            </button>
          </div>

          <div className="transactions">
            <section className="table">
              <p>Total de transações: {TransactionsList.length}</p>

              <div className="transactions__list">
                {TransactionsList.map((transaction, index) => {
                  return (
                    <p
                      className="transaction"
                      key={transaction.id}
                      onClick={() => foundTransactionById(transaction.id)}
                    >
                      {index + 1} - {transaction.product}
                    </p>
                  );
                })}
              </div>
            </section>
            <section className="visualization">
              {transactionSelected ? (
                <div>
                  <p className="transaction--product">
                    {transactionSelected.product}
                  </p>
                  <p className="transaction--value">
                    Valor: {numberToBrazilCurrency(transactionSelected.value)}
                  </p>
                  <p className="transaction--date">
                    Data:
                    {new Date(transactionSelected.date).toLocaleDateString()}
                  </p>
                  <p className="transaction--sellerName">
                    Vendedor: {transactionSelected.seller.name}
                  </p>
                  <p className="transaction--affiliated">
                    {transactionSelected.seller.role === 1
                      ? `Afiliado de: ${transactionSelected.seller.creator?.name}`
                      : ``}
                  </p>
                </div>
              ) : (
                <p className="visualization--noData">
                  Selecione uma transação para ver mais detalhes
                </p>
                // <Loading />
              )}
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
