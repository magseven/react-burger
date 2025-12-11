import { useForm } from '@/hooks/useForm';
import { passwordReset } from '@/utils/api';
import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './forgot-password.module.css';

type ForgotPasswordForm = {
  email: string;
};

export function ForgotPassword(): React.JSX.Element {
  const navigate = useNavigate();
  const { values, handleChange } = useForm<ForgotPasswordForm>({ email: '' });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    passwordReset({ email: values.email })
      .then(() => {
        localStorage.setItem('forgotPassword', 'true');
        void navigate('/reset-password');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
            value={values.email}
            onChange={handleChange}
          />
          <Button size="large" type="primary" htmlType={'submit'} extraClass={'mb-15'}>
            Восстановить
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
