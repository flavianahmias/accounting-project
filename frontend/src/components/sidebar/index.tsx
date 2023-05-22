'use client';
import './styles.scss';
import Link from 'next/link';
import SvgUser from '../../assets/users-solid.svg';
import SvgBagMoney from '../../assets/sack-dollar-solid.svg';
import SvgLogo from '../../assets/logo.svg';
import { usePathname } from 'next/navigation';

/**
 * Sidebar component
 * @returns
 */
export default function Sidebar() {
  const pathname = usePathname();

  /**
   * The function get the selected page and change style option
   * @param page page selected
   */
  const getSidebarButtonStyle = (pageSelected: string) => {
    return pageSelected === pathname ? 'selected' : '';
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <SvgLogo />
        <p>Contabilidade</p>
      </div>
      <Link href="/transactions" className="link">
        <button className={getSidebarButtonStyle('/transactions')}>
          <SvgBagMoney className="sidebarSVG" /> Transações
        </button>
      </Link>
      <Link href="/users" className="link">
        <button className={getSidebarButtonStyle('/users')}>
          <SvgUser className="sidebarSVG" /> Usuarios
        </button>
      </Link>
    </div>
  );
}
