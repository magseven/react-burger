import Modal from '@/components/modal/modal';
import { OrderLoading } from '@/components/order-details/order-loading';
import { selectBun, selectIngredients } from '@/services/ctor-ingredients/reducer';
import { selectIngredient } from '@/services/ingredient-details/reducer';
import { useGetIngredientsQuery } from '@/services/ingredients/api';
import { usePostOrderMutation } from '@/services/order/api';
import { closeOrderModal, openOrderModal } from '@/services/order/orderModalSlice';
import { selectUser } from '@/services/user/reducer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TOrderRequest } from '@/services/order/types';
import type { TIngredient } from '@utils/types.ts';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const { data, isLoading: loading, error } = useGetIngredientsQuery();
  const [postOrder, { isLoading: isOrderLoading }] = usePostOrderMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userSelector = useSelector(selectUser);

  const bun = useSelector(selectBun);
  const ctorIngredients = useSelector(selectIngredients);

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(selectIngredient(ingredient._id));
  };

  const handleOrderClick = async (): Promise<void> => {
    //setIsModalOpen(true);
    try {
      if (!userSelector) {
        void navigate('/login');
        return;
      }
      const orderData: TOrderRequest = {
        ingredients: [
          ...(bun ? [bun._id] : []),
          ...ctorIngredients.map((i) => i._id),
          ...(bun ? [bun._id] : []),
        ],
      };

      const result = await postOrder(orderData).unwrap();

      dispatch(openOrderModal(result.order.number));
    } catch (err: unknown) {
      dispatch(closeOrderModal());
      if (err instanceof Error) {
        console.error('Ошибка при создании заказа:', err.message);
      } else {
        console.error('Неизвестная ошибка при создании заказа', err);
      }
    }
  };

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

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>

        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients onIngredientClick={handleIngredientClick} />
          {ingredients?.[0] && (
            <BurgerConstructor
              orderLoading={isOrderLoading}
              onOrderClick={() => void handleOrderClick()}
            />
          )}
        </main>
      </DndProvider>
      {isOrderLoading && (
        <Modal isOpen={true} title="">
          <OrderLoading />
        </Modal>
      )}
    </>
  );
};
