import { useAppDispatch } from '@/services/store';
import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { login } from '@services/user/action';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './login.module.css';

export function Login(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log('Войти!');

    dispatch(login(form))
      .unwrap()
      .then(() => {
        console.log('Login successful!');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`text text_type_main-medium mb-6`}>Вход</div>
        <form className={`${styles.form} mb-15`} onSubmit={onSubmit}>
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
          <Button size="large" type="primary" extraClass={'mb-15'} htmlType="submit">
            Войти
          </Button>
        </form>

        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Вы — новый пользователь?
          <Link className="ml-2" to="/register">
            Зарегистрироваться
          </Link>
        </div>
        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Забыли пароль?
          <Link className="ml-2" to="/forgot-password">
            Восстановите пароль
          </Link>
        </div>
      </div>
    </section>
  );
}
