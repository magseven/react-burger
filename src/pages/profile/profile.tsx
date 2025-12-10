import { useAppDispatch } from '@/services/store';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logout } from '../../services/user/action';

import type React from 'react';

import styles from './profile.module.css';

export function Profile(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    dispatch(logout())
      .unwrap()
      .then(() => {
        void navigate('/login');
      })
      .catch((error: unknown) => {
        console.error('Logout failed:', error);
      });
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : 'text_color_inactive'}`;
  };

  return (
    <section className={styles.profileSection}>
      <div className={styles.leftColumn}>
        <NavLink to="/profile" className={getNavLinkClass} end>
          <p className="ml-2">Профиль</p>
        </NavLink>

        <NavLink to="/profile/orders" className={getNavLinkClass}>
          <p className="ml-2">История заказов</p>
        </NavLink>

        <a
          href="#"
          className={`${styles.link} text text_type_main-medium text_color_inactive`}
          onClick={onLogoutClick}
        >
          <p className="ml-2">Выход</p>
        </a>

        <div
          className={`${styles.infoText} pt-20 text text_type_main-default text_color_inactive`}
        >
          В этом разделе Вы можете
          <br />
          изменить свои персональные данные
        </div>
      </div>

      <div className={styles.rightColumn}>
        <Outlet />
      </div>
    </section>
  );
}
