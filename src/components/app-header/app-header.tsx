import { selectUser } from '@/services/user/reducer';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const userSelector = useSelector(selectUser);
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <div className={styles.iconTextWrapper}>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <div className={`${styles.iconTextWrapper} ml-10`}>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className={`text text_type_main-default ml-2`}>Лента заказов</p>
              </div>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : 'text_color_inactive'}`
          }
        >
          {({ isActive }) => (
            <div className={styles.iconTextWrapper}>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="ml-2">{userSelector?.name ?? 'Личный кабинет'}</p>
            </div>
          )}
        </NavLink>

        {/* <a href="/profile" className={`${styles.link} ${styles.link_position_last}`}>
          <ProfileIcon type="secondary" />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </a> */}
      </nav>
    </header>
  );
};
