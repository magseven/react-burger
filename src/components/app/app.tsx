import { Account } from '@/pages/account/account';
import { ForgotPassword } from '@/pages/forgot-password/forgot-password';
import { Home } from '@/pages/home/home';
import { Login } from '@/pages/login/login';
import { NotFound } from '@/pages/not-found/not-found';
import { Profile } from '@/pages/profile/profile';
import { Register } from '@/pages/register/register';
import { ResetPassword } from '@/pages/reset-password/reset-password';
import { clearOrder } from '@/services/ctor-ingredients/reducer';
import { clearIngredient } from '@/services/ingredient-details/reducer';
import { getIngredients } from '@/services/ingredients/action';
import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/ingredients/reducer';
import { closeOrderModal, selectOrderIsOpen } from '@/services/order/orderModalSlice';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { checkUserAuth } from '@/services/user/action';
import { useCallback, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';

import { OrderDetails } from '../order-details/order-details';
import { ProtectedRoute } from '../protected-route/protected-route';

import type React from 'react';

import styles from './app.module.css';

type LocationState = {
  from?: {
    pathname?: string;
  };
  [key: string]: unknown;
};

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const dispatch = useAppDispatch();
  const orderIsOpen = useAppSelector(selectOrderIsOpen);

  const isLoading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);

  useEffect((): void => {
    void dispatch(checkUserAuth());
  }, []);

  useEffect(() => {
    void dispatch(getIngredients());
  }, []);

  const navigate = useNavigate();

  const handleCloseModal = useCallback(
    (isOrder: boolean): void => {
      dispatch(clearIngredient());

      if (isOrder) dispatch(closeOrderModal());

      const state = location.state as LocationState | null | undefined;
      const possiblePathname = state?.from?.pathname;
      const targetPath = typeof possiblePathname === 'string' ? possiblePathname : '/';

      dispatch(clearOrder());
      void navigate(targetPath);
    },
    [dispatch, location, navigate]
  );

  if (isLoading) return <div>Загружается список ингредиентов...</div>;
  if (error) return <div>Ошибка загрузки ингредиентов ...</div>;

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/ingredient/:id"
          element={
            <div className={styles.details}>
              <IngredientDetails />
            </div>
          }
        />
        <Route path="/profile" element={<ProtectedRoute component={<Profile />} />}>
          <Route index element={<Account />} />
          <Route path="orders" element={<NotFound />} />
        </Route>
        <Route
          path="/forgot-password"
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path="/reset-password"
          element={
            localStorage.getItem('forgotPassword') === 'true' ? (
              <ProtectedRoute onlyUnAuth component={<ResetPassword />} />
            ) : (
              <Navigate to="/forgot-password" replace />
            )
          }
        />
        <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/ingredient/:id"
            element={
              <Modal
                isOpen={true}
                onClick={() => handleCloseModal(false)}
                title="Детали ингредиента"
              >
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
      {orderIsOpen && (
        <Modal isOpen={true} onClick={() => handleCloseModal(true)} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
