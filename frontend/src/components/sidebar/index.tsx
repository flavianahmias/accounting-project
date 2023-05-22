import './styles.scss';
import Link from 'next/link';
import SvgUser from '../../assets/users-solid.svg';
import SvgBagMoney from '../../assets/sack-dollar-solid.svg';
import SvgLogo from '../../assets/logo.svg';
import SvgLogoSymbol from '../../assets/logo-symbol.svg';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [location, setLocation] = useState('');

  useEffect(() => {
    const getPathname = window.location.pathname.replace('/', '');
    setLocation(getPathname);
    changeSelectedPageStyle(getPathname);
  });

  const handleClickOption = (page: string) => {
    if (page !== location) {
      setLocation(page);
      changeSelectedPageStyle(page);
    }
  };

  const changeSelectedPageStyle = (pageSelected: string) => {
    if (pageSelected === location) return 'selected';
    else 'notSelected';
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <SvgLogo />
        <p>Contabilidade</p>
      </div>
      <Link
        href="/transactions"
        className="link"
        onClick={() => handleClickOption('transactions')}
      >
        <button className={changeSelectedPageStyle('transactions')}>
          <SvgBagMoney className="sidebarSVG" /> Transações
        </button>
      </Link>
      <Link
        href="/users"
        className="link"
        onClick={() => handleClickOption('users')}
      >
        <button className={changeSelectedPageStyle('users')}>
          <SvgUser className="sidebarSVG" /> Usuarios
        </button>
      </Link>
    </div>
  );
}
