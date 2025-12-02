import { Home } from '@/pages/home/home';
import {} from //  clearOrder,
//  selectBun,
//  selectIngredients,
'@/services/ctor-ingredients/reducer';
import {
  //  selectIngredient,
  clearIngredient,
  selectSelectedId,
} from '@/services/ingredient-details/reducer';
import { useGetIngredientsQuery } from '@/services/ingredients/api';
//import { usePostOrderMutation } from '@/services/order/api';
import {
  closeOrderModal,
  //  openOrderModal,
  selectOrderIsOpen,
} from '@/services/order/orderModalSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

//import type { TOrderRequest } from '@/services/order/types';
import type { TIngredient } from '@utils/types.ts';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data, isLoading: loading, error } = useGetIngredientsQuery();
  //  const [postOrder, { isLoading: orderLoading }] = usePostOrderMutation();

  const dispatch = useDispatch();

  const selectedId = useSelector(selectSelectedId);
  const orderIsOpen = useSelector(selectOrderIsOpen);
  // const bun = useSelector(selectBun);
  // const ctorIngredients = useSelector(selectIngredients);

  // const handleIngredientClick = (ingredient: TIngredient): void => {
  //   dispatch(selectIngredient(ingredient._id));
  // };

  // const handleOrderClick = async (): Promise<void> => {
  //   try {
  //     const orderData: TOrderRequest = {
  //       ingredients: [
  //         ...(bun ? [bun._id] : []),
  //         ...ctorIngredients.map((i) => i._id),
  //         ...(bun ? [bun._id] : []),
  //       ],
  //     };

  //     const result = await postOrder(orderData).unwrap();
  //     dispatch(openOrderModal(result.order.number));
  //   } catch (err: unknown) {
  //     dispatch(closeOrderModal());
  //     if (err instanceof Error) {
  //       console.error('Ошибка при создании заказа:', err.message);
  //     } else {
  //       console.error('Неизвестная ошибка при создании заказа', err);
  //     }
  //   }
  // };

  const handleCloseModal = useCallback(() => {
    dispatch(clearIngredient());
    dispatch(closeOrderModal());
    //dispatch(clearOrder());
  }, []);

  if (loading) {
    return <div>Загружается список ингредиентов...</div>;
  }

  if (error) {
    if ('data' in error) {
      console.log('Error:', error.data);
      return <div>Error...</div>;
    } else {
      console.log('Error:', error);
      return <div>Error...</div>;
    }
  }

  const ingredients: TIngredient[] = data?.data ?? [];
  const ingredientShowDetails = ingredients?.find((ingr) => ingr._id === selectedId);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      {ingredientShowDetails && (
        <Modal isOpen={true} onClick={handleCloseModal} title="Детали ингредиента">
          <IngredientDetails ingredient={ingredientShowDetails} />
        </Modal>
      )}
      {orderIsOpen && (
        <Modal isOpen={true} onClick={handleCloseModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
