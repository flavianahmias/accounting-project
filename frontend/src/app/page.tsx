'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

import { getTransactions } from '@/service/transactions';

interface ITransaction {
  id: number;
  type: number;
  product: string;
  date: string;
  value: number;
}

export default function Home() {
  const [TransactionsList, setTransactionsList] = useState<ITransaction[]>([]);

  useEffect(() => {
    getTransactions((response) => {
      try {
        if (response.status === 200) {
          setTransactionsList(response.data);
          console.log(TransactionsList);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);
  return (
    <div className="home">
      <Sidebar />
      <Container>
        <div className="transactions__container">
          <div className="forms">Formulario </div>

          <div className="list">
            <section className="table">{TransactionsList[0].product}</section>
            <section className="visualization"></section>
          </div>
        </div>
      </Container>
    </div>
  );
}
