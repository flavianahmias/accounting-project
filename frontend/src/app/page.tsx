'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

import {
  getTransactions,
  getTransactionsById,
  uploadTransactions,
} from '@/service/transactions';

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

  useEffect(() => {
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
      console.log(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    uploadTransactions(file, (response) => {
      console.log(response);
    });
  };

  return (
    <div className="home">
      <Sidebar />
      <Container>
        <div className="transactions__container">
          <div className="forms">
            <div className="drop">
              <label htmlFor="selecao-arquivo">Insira seu arquivo</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="input"
                id="selecao-arquivo"
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
              <p>Detalhes da transação</p>
              {transactionSelected ? (
                <div>
                  <p className="transaction--product">
                    {transactionSelected.product}
                  </p>
                  <p className="transaction--value">
                    Valor: {transactionSelected.value}
                  </p>
                  <p className="transaction--date">
                    Data:
                    {new Date(transactionSelected.date).toLocaleDateString()}
                  </p>
                  <p className="transaction--sellerName">
                    Vendedor: {transactionSelected.seller.name}
                  </p>
                  <p className="transaction--affilliate">
                    {transactionSelected.seller.role === 1
                      ? `Afiliado de: ${transactionSelected.seller.creator?.name}`
                      : ``}
                  </p>
                </div>
              ) : (
                <div>Selecione uma transação para ver mais</div>
              )}
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
