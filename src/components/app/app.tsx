import { ForgotPassword } from '@/pages/forgot-password/forgot-password';
import { Home } from '@/pages/home/home';
import { NotFound } from '@/pages/not-found/not-found';
import { SignIn } from '@/pages/sign-in/sign-in';
import {
  clearIngredient,
  selectSelectedId,
} from '@/services/ingredient-details/reducer';
import { useGetIngredientsQuery } from '@/services/ingredients/api';
import { closeOrderModal, selectOrderIsOpen } from '@/services/order/orderModalSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types.ts';
import type React from 'react';

import styles from './app.module.css';

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
  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetIngredientsQuery();
  const selectedId = useSelector(selectSelectedId);
  const orderIsOpen = useSelector(selectOrderIsOpen);

  const handleCloseModal: () => void = useCallback(() => {
    dispatch(clearIngredient());
    dispatch(closeOrderModal());
  }, [dispatch]);

  const ingredients: TIngredient[] = data?.data ?? [];

  if (isLoading) return <div>Загружается список ингредиентов...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const ingredientShowDetails = ingredients.find((ing) => ing._id === selectedId);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
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
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Модалка ингредиента при клике */}
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

      {/* Модалка заказа */}
      {orderIsOpen && (
        <Modal isOpen={true} onClick={handleCloseModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
