import { useAppDispatch } from '@/services/store';
import { passwordForgot } from '@/services/user/action';
import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './forgot-password.module.css';

export function ForgotPassword(): React.JSX.Element {
  const [form, setForm] = useState({ email: '' });
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useAppDispatch();

  const onClick = (): void => {
    dispatch(passwordForgot(form))
      .unwrap()
      .then(() => {
        console.log('Email sent!');
        setEmailSent(true);
      })
      .catch((error) => {
        console.error('passwordForgot failed:', error);
      });
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
        <form className={`${styles.form} mb-15`}>
          {emailSent === true ? (
            <Input
              name="email"
              extraClass="mb-6"
              placeholder="Укажите e-mail"
              value={form.email}
              onChange={onChange}
            />
          ) : (
            <div className="text text_type_main-default mb-4">
              Email отправлен, ждите!
            </div>
          )}
          <Button
            size="large"
            type="primary"
            htmlType={'button'}
            extraClass={'mb-15'}
            onClick={onClick}
          >
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
