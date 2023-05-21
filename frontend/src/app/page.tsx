'use client';

import { useEffect, useState } from 'react';
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

  // const handleChange = (field, value) => {
  //   console.log(field, value);
  //   // setData((current) => {
  //   //   return { ...current, [field]: value };
  //   // });
  //   // setErrors((current) => current.filter((err) => err != field));
  // };
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
          <div className="forms">
            {/* <input
              type="text"
              name="form"
              // onChange={(name, value) => handleChange(name, value.target.value)}
            /> */}

            <input type="file" />
          </div>

          <div className="list">
            <section className="table">{TransactionsList[0]?.product}</section>
            <section className="visualization"></section>
          </div>
        </div>
      </Container>
    </div>
  );
}
