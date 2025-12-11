import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './not-found.module.css';

export function NotFound(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <h1>Ошибка 404</h1>
      <p>Запрошенная Вами страница не существует</p>
      <br />
      <p>
        проверьте адрес или попробуйте <Link to="/">Домашняя страница</Link>
      </p>
    </div>
  );
}
