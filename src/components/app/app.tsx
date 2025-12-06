import { Account } from '@/pages/account/account';
import { ForgotPassword } from '@/pages/forgot-password/forgot-password';
import { Home } from '@/pages/home/home';
import { Login } from '@/pages/login/login';
import { NotFound } from '@/pages/not-found/not-found';
import { Profile } from '@/pages/profile/profile';
import { Register } from '@/pages/register/register';
import { ResetPassword } from '@/pages/reset-password/reset-password';
import {
  clearIngredient,
  selectSelectedId,
} from '@/services/ingredient-details/reducer';
import { useGetIngredientsQuery } from '@/services/ingredients/api';
import { closeOrderModal, selectOrderIsOpen } from '@/services/order/orderModalSlice';
import { useAppDispatch } from '@/services/store';
import { checkUserAuth } from '@/services/user/action';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import { ProtectedRoute } from '../protected-route/protected-route';

import type { TIngredient } from '@utils/types.ts';
import type React from 'react';

import styles from './app.module.css';

type LocationState = {
  from?: {
    pathname?: string;
  };
  [key: string]: unknown; // для других возможных полей
};

const IngredientPage = ({
  ingredients,
}: {
  ingredients: TIngredient[];
}): React.JSX.Element => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (!ingredients.length) return <div>Загружается список ингредиентов...</div>;

  const ingredientShowDetails = ingredients.find((ing) => ing._id === id);

  if (!ingredientShowDetails) return <div>Ингредиент не найден</div>;

  return <IngredientDetails ingredient={ingredientShowDetails} />;
};

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const dispatch = useAppDispatch();

  useEffect((): void => {
    void dispatch(checkUserAuth());
  }, []);

  const { data, isLoading, error } = useGetIngredientsQuery();
  const selectedId = useSelector(selectSelectedId);
  const orderIsOpen = useSelector(selectOrderIsOpen);

  const navigate = useNavigate();

  const handleCloseModal = useCallback((): void => {
    dispatch(clearIngredient());
    dispatch(closeOrderModal());

    const state = location.state as LocationState | null | undefined;
    const possiblePathname = state?.from?.pathname;
    const targetPath = typeof possiblePathname === 'string' ? possiblePathname : '/';

    void navigate(targetPath);
  }, [dispatch, location, navigate]);

  const ingredients: TIngredient[] = data?.data ?? [];

  if (isLoading) return <div>Загружается список ингредиентов...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const ingredientShowDetails = ingredients.find((ing) => ing._id === selectedId);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/ingredient/:id"
          element={
            <div className={styles.details}>
              <IngredientPage ingredients={ingredients} />
            </div>
          }
        />
        <Route path="/profile" element={<ProtectedRoute component={<Profile />} />}>
          <Route index element={<Account />} />
          {/* <Route path='orders' element={<Home/>}/>   */}
        </Route>
        <Route
          path="/forgotPassword"
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path="/resetPassword"
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
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

      {state?.backgroundLocation && ingredientShowDetails && (
        <Routes>
          <Route
            path="/ingredient/:id"
            element={
              <Modal isOpen={true} onClick={handleCloseModal} title="Детали ингредиента">
                <IngredientDetails ingredient={ingredientShowDetails} />
              </Modal>
            }
          />
        </Routes>
      )}

      {orderIsOpen && (
        <Modal isOpen={true} onClick={handleCloseModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
