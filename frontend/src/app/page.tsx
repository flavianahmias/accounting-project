'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

import { getTransactions } from '@/service/transactions';

export default function Home() {
  const [TransactionsList, setTransactionsList] = useState([]);

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
  return (
    <div className="home">
      <Sidebar />
      <Container>
        <div className="transactions__container">
          <div className="forms">Formulario </div>

          <div className="list">
            <section className="table"></section>
            <section className="visualization"></section>
          </div>
        </div>
      </Container>
    </div>
  );
}
