'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

import { getTransactions, uploadTransactions } from '@/service/transactions';

interface ITransaction {
  id: number;
  type: number;
  product: string;
  date: string;
  value: number;
}

export default function Home() {
  const [TransactionsList, setTransactionsList] = useState<ITransaction[]>([]);

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
            <button onClick={handleUploadClick}>Upload</button>
          </div>

          <div className="transactions">
            <section className="table">
              <p>Total de transações: {TransactionsList.length}</p>

              <div className="transactions__list">
                {TransactionsList.map((transaction) => {
                  return (
                    <p className="transaction" key={transaction.id}>
                      {transaction.product}
                    </p>
                  );
                })}
              </div>
            </section>
            <section className="visualization"></section>
          </div>
        </div>
      </Container>
    </div>
  );
}
