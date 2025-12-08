import { passwordReset2 } from '@/utils/api';
import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './reset.module.css';

export function ResetPassword(): React.JSX.Element {
  const [form, setForm] = useState({ password: '', token: '' });
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    try {
      e.preventDefault();
      void passwordReset2(form);
      localStorage.removeItem('forgotPassword');
      void navigate('/login');
    } catch (err: unknown) {
      console.log('Ошибка восстановления пароля.', err);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`text text_type_main-large mb-6`}>Восстановление пароля</div>
        <form className={`${styles.form} mb-15`} onSubmit={onSubmit}>
          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={onChange}
            extraClass="mb-6"
            placeholder="Введите новый пароль"
            value={form.password}
          />
          <Input
            extraClass="mb-6"
            placeholder="Введите код из письма"
            name="token"
            value={form.token}
            onChange={onChange}
          />
          <Button size="large" type="primary" htmlType={'submit'} extraClass={'mb-15'}>
            Сохранить
          </Button>
        </form>

        <div className={`text text_type_main-default text_color_inactive mt-6`}>
          Вспомнили пароль?
          <Link className="ml-2" to="/login">
            Войти
          </Link>
        </div>
      </div>
    </section>
  );
}
