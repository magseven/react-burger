import { useAppDispatch } from '@/services/store';
import { register } from '@/services/user/action';
import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './register.module.css';

export function Register(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onClick = (): void => {
    dispatch(register(form))
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
        <div className={`text text_type_main-large mb-6`}>Регистрация</div>
        <form className={`${styles.form} mb-15`}>
          <Input
            extraClass="mb-6"
            name="name"
            placeholder="Имя"
            value={form.name}
            onChange={onChange}
          />
          <Input
            extraClass="mb-6"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={onChange}
          />
          <PasswordInput
            extraClass="mb-6"
            name="password"
            placeholder="Пароль"
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
            Зарегистрироваться
          </Button>
        </form>

        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Уже зарегистрированы?
          <Link className="ml-2" to="/login">
            Войти
          </Link>
        </div>
      </div>
    </section>
  );
}
