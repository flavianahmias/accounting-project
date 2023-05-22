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
import Loading from '@/components/loading';
import { getUsers } from '@/service/users';

export interface IUser {
  id: number;
  name: string;
  role: number;
  balance: number;
  creator?: IUser;
}

export interface ITransaction {
  id: number;
  type: number;
  product: string;
  date: string;
  value: number;
  seller: IUser;
}

export default function Home() {
  const [usersList, setUsersList] = useState<IUser[]>([]);

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');

  let loadingFile = false;

  const getAllUsers = useCallback(() => {
    getUsers((response) => {
      try {
        if (response.status === 200) {
          setUsersList(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  // const foundTransactionById = (id: number) => {
  //   getTransactionsById(id, (response) => {
  //     try {
  //       if (response.status === 200) {
  //         setTransactionsSelected(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // };

  const checkTransatctionType = (type: number) => {
    switch (type) {
      case 1:
        return 'Venda criador';
        break;
      case 2:
        return 'Venda Afiliado';
        break;
      case 3:
        return 'Comissão paga';
        break;
      case 4:
        return 'Comissão recebida';
        break;
      default:
        break;
    }
  };

  const numberToBrazilCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format;

  return (
    <div className="home">
      <title>Usuários</title>
      <Sidebar />
      <Container>
        <div className="transactions__container">
          <div className="transactions">
            <section className="table">
              <p>Total de usuários: {usersList.length}</p>

              <div className="transactions__list">
                {usersList.map((user, index) => {
                  return (
                    <p
                      className="transaction"
                      key={user.id}
                      // onClick={() => foundTransactionById(transaction.id)}
                    >
                      {user.name}
                      {/* {'  '}
                      <span className={`transaction--type${user.role}`}>
                        {checkTransatctionType(transaction.type)}
                      </span> */}
                    </p>
                  );
                })}
              </div>
            </section>
            {/* <section className="visualization">
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
            </section> */}
          </div>
        </div>
      </Container>
    </div>
  );
}
