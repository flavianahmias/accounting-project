import './styles.css';
import Link from 'next/link';

export default function Sidebar() {
  const location = window.location.pathname.replace('/', '');

  const changeSelectedPageStyle = (pageSelected: string) => {
    if (pageSelected === location) return 'selected';
    else 'notSelected';
  };

  return (
    <div className="sidebar">
      <Link href="/transactions">
        <button className={changeSelectedPageStyle('transactions')}>
          Transações
        </button>
      </Link>
      <Link href="/users">
        <button className={changeSelectedPageStyle('users')}>Usuarios</button>
      </Link>
    </div>
  );
}
