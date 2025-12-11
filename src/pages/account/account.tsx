import { useForm } from '@/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { userPatch } from '@/services/user/action';
import { selectUser } from '@/services/user/reducer';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './account.module.css';

type UserForm = {
  name: string;
  email: string;
  password: string;
};

export function Account(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userSelector = useAppSelector(selectUser);

  const { values, handleChange, setValues } = useForm<UserForm>({
    name: userSelector?.name ?? '',
    email: userSelector?.email ?? '',
    password: '',
  });

  const [nameDisabled, setNameDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [passDisabled, setPassDisabled] = useState(true);

  useEffect(() => {
    if (userSelector) {
      setValues({
        name: userSelector.name || '',
        email: userSelector.email || '',
        password: '',
      });
      setNameDisabled(true);
      setEmailDisabled(true);
      setPassDisabled(true);
    }
  }, [userSelector, setValues]);

  const isDirty = useMemo(
    () =>
      values.password !== '' ||
      values.name !== userSelector?.name ||
      values.email !== userSelector?.email,
    [values, userSelector]
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    dispatch(
      userPatch({
        name: values.name,
        email: values.email,
        password: values.password || '',
      })
    )
      .unwrap()
      .then(() => {
        setValues((prev) => ({
          ...prev,
          password: '',
        }));
        setNameDisabled(true);
        setEmailDisabled(true);
        setPassDisabled(true);
      })
      .catch((error) => {
        console.error('Ошибка сохранения данных:', error);
      });
  };

  const handleCancel = (): void => {
    setValues({
      name: userSelector?.name ?? '',
      email: userSelector?.email ?? '',
      password: '',
    });
    setNameDisabled(true);
    setEmailDisabled(true);
    setPassDisabled(true);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          extraClass="mb-6"
          placeholder="Имя"
          name="name"
          value={values.name}
          onChange={handleChange}
          icon={!nameDisabled ? 'CloseIcon' : 'EditIcon'}
          disabled={nameDisabled}
          onIconClick={() => setNameDisabled(!nameDisabled)}
        />
        <Input
          extraClass="mb-6"
          placeholder="E-mail"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          icon={!emailDisabled ? 'CloseIcon' : 'EditIcon'}
          disabled={emailDisabled}
          onIconClick={() => setEmailDisabled(!emailDisabled)}
        />
        <Input
          extraClass="mb-6"
          placeholder="Пароль"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
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
              onClick={handleCancel}
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
