import { passwordReset } from '@/utils/api';
import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './forgot-password.module.css';

export function ForgotPassword(): React.JSX.Element {
  const [form, setForm] = useState({ email: '' });
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void (async (): Promise<void> => {
      try {
        e.preventDefault();

        await passwordReset(form);
        await navigate('/reset-password');
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`text text_type_main-medium mb-6`}>Восстановление пароля</div>
        <form className={`${styles.form} mb-15`} onSubmit={onSubmit}>
          <Input
            name="email"
            extraClass="mb-6"
            placeholder="Укажите e-mail"
            value={form.email}
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
