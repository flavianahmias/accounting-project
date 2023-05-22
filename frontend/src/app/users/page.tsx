'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import './page.scss';

import { getUsers, getUserById } from '@/service/users';
import { IUser } from '@/helpers/interfaces';
import { numberToBrazilCurrency } from '@/helpers/common';

export default function Home() {
  const [usersList, setUsersList] = useState<IUser[]>([]);

  /**
   * This function makes the request to receive the complete list of users in the system;
   */
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

  /**
   * This function checks the type of user.
   * @param type the user role
   * @returns user role in full
   */
  const checkUserRole = (type: number) => {
    switch (type) {
      case 0:
        return 'Criador';
      case 1:
        return 'Afiliado';
      default:
        break;
    }
  };

  return (
    <div className="home">
      <title>Usuários</title>
      <Sidebar />
      <div className="content">
        <h3>Usuários cadastrados</h3>
        {usersList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Id</th>
                <th>Nome</th>
                <th style={{ width: '100px' }}>Cargo</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, index) => {
                return (
                  <tr key={index} className="user">
                    <td style={{ width: '50px' }}>#{index + 1}</td>
                    <td>{user.name}</td>
                    <td style={{ width: '100px' }}>
                      <p className={checkUserRole(user.role)}>
                        {checkUserRole(user.role)}
                      </p>
                    </td>
                    <td>{numberToBrazilCurrency(user.balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Nenhum usuário cadastrado</p>
        )}
      </div>
    </div>
  );
}
