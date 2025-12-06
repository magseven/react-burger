import { useAppDispatch } from '@/services/store';
import { NavLink, Outlet } from 'react-router-dom';

import { logout } from '../../services/user/action';

import type React from 'react';

import styles from './profile.module.css';

export function Profile(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const onLogoutClick = (): void => {
    void dispatch(logout());
  };

  return (
    <section className={styles.profileSection}>
      <div className={styles.leftColumn}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.navLink} text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `${styles.navLink} text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`
          }
        >
          История заказов
        </NavLink>
        <NavLink
          to="/logout"
          className={({ isActive }) =>
            `${styles.navLink} text text_type_main-medium ${isActive ? '' : 'text_color_inactive'}`
          }
          onClick={onLogoutClick}
        >
          Выход
        </NavLink>

        <div className={`${styles.infoText} pt-15`}>
          В этом разделе Вы можете изменить свои персональные данные
        </div>
      </div>

      <div className={styles.rightColumn}>
        <Outlet />
      </div>
    </section>
  );
}
