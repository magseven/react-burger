import Modal from '@/components/modal/modal';
import { OrderLoading } from '@/components/order-details/order-loading';
import { selectBun, selectCtorIngredients } from '@/services/ctor-ingredients/reducer';
import { selectIngredient } from '@/services/ingredient-details/reducer';
import { selectAllIngredients } from '@/services/ingredients/reducer';
import { postOrder } from '@/services/order/action';
import { closeOrderModal, openOrderModal } from '@/services/order/orderModalSlice';
import { selectIsOrderLoading } from '@/services/order/reducer';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { selectUser } from '@/services/user/reducer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TOrderRequest } from '@/services/order/types';
import type { TIngredient } from '@utils/types.ts';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const userSelector = useAppSelector(selectUser);

  const bun = useAppSelector(selectBun);
  const ctorIngredients = useAppSelector(selectCtorIngredients);

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(selectIngredient(ingredient._id));
  };

  const ingredients = useAppSelector(selectAllIngredients);
  const isOrderLoading = useAppSelector(selectIsOrderLoading);

  const handleOrderClick = async (): Promise<void> => {
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

      const orderResponse = await dispatch(postOrder(orderData)).unwrap();

      dispatch(openOrderModal(orderResponse.number));
    } catch (err: unknown) {
      dispatch(closeOrderModal());
      if (err instanceof Error) {
        console.error('Ошибка при создании заказа:', err.message);
      } else {
        console.error('Неизвестная ошибка при создании заказа', err);
      }
    }
  };
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
