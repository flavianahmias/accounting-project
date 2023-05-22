'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const checkUserRole = (type: number, className?: boolean) => {
    switch (type) {
      case 0:
        return className ? 'creator' : 'Criador';
      case 1:
        return className ? 'affiliated' : 'Afiliado';
      default:
        break;
    }
  };

  return (
    <div className="home">
      <title>Usuários</title>
      <div className="content">
        <h1>Usuários cadastrados</h1>
        <hr />
        {usersList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Saldo</th>
                <th>Afiliado de {'*'}</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>{user.name}</td>
                    <td>
                      <div className={checkUserRole(user.role, true)}>
                        <p>{checkUserRole(user.role)}</p>
                      </div>
                    </td>
                    <td>{numberToBrazilCurrency(user.balance)}</td>
                    <td>{user.creator?.name ? user.creator?.name : '-'}</td>
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
