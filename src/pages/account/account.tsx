import { useAppDispatch } from '@/services/store';
import { userPatch } from '@/services/user/action';
import { selectUser } from '@/services/user/reducer';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './account.module.css';

export function Account(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userSelector = useSelector(selectUser);
  const [form, setForm] = useState(userSelector ?? { name: '', email: '' });
  const [nameDisabled, setNameDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [passDisabled, setPassDisabled] = useState(true);
  const [password, setPassword] = useState('');

  const reset = (): void => {
    setNameDisabled(true);
    setEmailDisabled(true);
    setPassDisabled(true);
    setPassword('');
    setForm(userSelector ?? { name: '', email: '' });
  };

  useEffect(() => {
    if (userSelector) {
      reset();
    }
  }, [userSelector]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name === 'password') setPassword(value);
    else
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const isDirty = useMemo(
    () =>
      password !== '' ||
      form.name !== userSelector?.name ||
      form.email !== userSelector.email,
    [password, form, userSelector]
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    dispatch(userPatch({ ...form, password })).catch((error) => {
      console.error('Ошибка сохранения данных:', error);
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          extraClass="mb-6"
          placeholder="Имя"
          name="name"
          value={form?.name ?? ''}
          onChange={onChange}
          icon={!nameDisabled ? 'CloseIcon' : 'EditIcon'}
          disabled={nameDisabled}
          onIconClick={() => setNameDisabled(!nameDisabled)}
        />
        <Input
          extraClass="mb-6"
          placeholder="E-mail"
          name="email"
          type="email"
          value={form?.email ?? ''}
          onChange={onChange}
          icon={!emailDisabled ? 'CloseIcon' : 'EditIcon'}
          disabled={emailDisabled}
          onIconClick={() => setEmailDisabled(!emailDisabled)}
        />
        <Input
          extraClass="mb-6"
          placeholder="Пароль"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          icon={!passDisabled ? 'CloseIcon' : 'EditIcon'}
          disabled={passDisabled}
          onIconClick={() => setPassDisabled(!passDisabled)}
        />
        {isDirty && (
          <div className={styles.buttons}>
            <Button
              size="large"
              type="secondary"
              extraClass={'mb-15'}
              htmlType="button"
              onClick={reset}
            >
              Отмена
            </Button>
            <Button size="large" type="primary" extraClass={'mb-15'} htmlType="submit">
              Сохранить
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
