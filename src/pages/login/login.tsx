import { useForm } from '@/hooks/useForm';
import { useAppDispatch } from '@/services/store';
import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { login } from '@services/user/action';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './login.module.css';

type LoginForm = {
  email: string;
  password: string;
};

export function Login(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const { values, handleChange } = useForm<LoginForm>({
    email: '',
    password: '',
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log('Войти!');

    dispatch(login(values))
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
            value={values.email}
            onChange={handleChange}
          />
          <PasswordInput
            extraClass="mb-6"
            placeholder="Пароль"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <Button
            size="large"
            type="primary"
            extraClass={'mb-15'}
            htmlType="submit"
            data-testid="login-button"
          >
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
