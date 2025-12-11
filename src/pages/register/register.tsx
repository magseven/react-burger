import { useForm } from '@/hooks/useForm';
import { useAppDispatch } from '@/services/store';
import { register } from '@/services/user/action';
import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './register.module.css';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export function Register(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { values, handleChange } = useForm<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!values.name.trim() || !values.email.trim() || !values.password.trim()) {
      console.error('Все поля обязательны для заполнения');
      return;
    }

    dispatch(register(values))
      .unwrap()
      .then(() => {
        void navigate('/');
      })
      .catch((error) => {
        console.error('Register failed:', error);
      });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`text text_type_main-large mb-6`}>Регистрация</div>
        <form className={`${styles.form} mb-15`} onSubmit={onSubmit}>
          <Input
            extraClass="mb-6"
            name="name"
            placeholder="Имя"
            value={values.name}
            onChange={handleChange}
          />
          <Input
            extraClass="mb-6"
            name="email"
            placeholder="E-mail"
            value={values.email}
            onChange={handleChange}
          />
          <PasswordInput
            extraClass="mb-6"
            name="password"
            placeholder="Пароль"
            value={values.password}
            onChange={handleChange}
          />
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            extraClass={'mb-15'}
            disabled={
              !values.name.trim() || !values.email.trim() || !values.password.trim()
            }
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
