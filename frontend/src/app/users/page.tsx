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
import { getUsers, getUserById } from '@/service/users';

export const numberToBrazilCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format;

export interface IUser {
  id: number;
  name: string;
  role: number;
  balance: number;
  creator: IUser;
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
  const [userSelected, setUserSelected] = useState<IUser>();

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

  const foundUserById = (id: number) => {
    getUserById(id, (response) => {
      try {
        if (response.status === 200) {
          setUserSelected(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const checkUserRole = (type: number) => {
    switch (type) {
      case 0:
        return 'Criador';
        break;
      case 1:
        return 'Afiliado';
        break;
      default:
        break;
    }
  };

  return (
    <div className="home">
      <title>Usuários</title>
      <Sidebar />
      <div className="content">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user, index) => {
              console.log(user);
              return (
                <tr key={index} className="user">
                  <td>#{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{checkUserRole(user.role)}</td>
                  <td>{numberToBrazilCurrency(user.balance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
