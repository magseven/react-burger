import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './sign-in.module.css';

export function SignIn(): React.JSX.Element {
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClick = (): void => {
    console.log('Клик!');
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`text text_type_main-medium mb-6`}>Вход</div>
        <form className={`${styles.form} mb-15`}>
          <Input
            extraClass="mb-6"
            placeholder="E-mail"
            name="email"
            value={form.email}
            onChange={onChange}
          />
          <PasswordInput
            extraClass="mb-6"
            placeholder="Пароль"
            name="password"
            value={form.password}
            onChange={onChange}
          />
          <Button
            onClick={onClick}
            size="large"
            type="primary"
            htmlType={'button'}
            extraClass={'mb-15'}
          >
            Войти
          </Button>
        </form>

        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Вы — новый пользователь?
          <Link className="ml-2" to="/login">
            Зарегистрироваться
          </Link>
        </div>
        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Забыли пароль?
          <Link className="ml-2" to="/login">
            Восстановите пароль
          </Link>
        </div>
      </div>
    </section>
  );
}
