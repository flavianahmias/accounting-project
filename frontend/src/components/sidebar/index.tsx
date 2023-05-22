import { useState } from 'react';
import './styles.css';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const [page, setPage] = useState('transactions');

  const handleChangePage = (page: string) => {
    setPage(page);
    redirect(`/${page}`);
  };

  const changeSelectedPageStyle = (pageSelected: string) => {
    if (page === pageSelected) return 'selected';
    else 'notSelected';
  };

  return (
    <div className="sidebar">
      <Link href="/transactions">
        <button
          className={changeSelectedPageStyle('transactions')}
          onClick={() => {
            setPage('transactions');
            handleChangePage('transactions');
          }}
        >
          Transações
        </button>
      </Link>
      <Link href="/users">
        <button
          className={changeSelectedPageStyle('users')}
          onClick={() => {
            setPage('users');
            handleChangePage('users');
          }}
        >
          Usuarios
        </button>
      </Link>
    </div>
  );
}
