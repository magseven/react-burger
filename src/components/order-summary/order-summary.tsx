import { selectFeed } from '@/services/feed-orders/slice';
import { selectHistory } from '@/services/history-orders/slice';
import { selectIngredientsByIds } from '@/services/ingredients/reducer';
import { getOrder } from '@/services/order/action';
import { selectGetOrderSummary } from '@/services/order/reducer';
import { useAppSelector, useAppDispatch } from '@/services/store';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import styles from './order-summary.module.css';

export const OrderSummary = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { id: number } = useParams();

  const feedOrders = useAppSelector(selectFeed).orders;
  const historyOrders = useAppSelector(selectHistory).orders;
  const summaryOrder = useAppSelector(selectGetOrderSummary);

  const order = useMemo(() => {
    const num = +number!;

    return (
      feedOrders.find((order) => order.number === num) ??
      historyOrders.find((order) => order.number === num) ??
      summaryOrder
    );
  }, [number, feedOrders, historyOrders, summaryOrder]);

  const ingredientIds = [...new Set(order?.ingredients ?? [])];
  const ingredientsSelector = useAppSelector(selectIngredientsByIds(ingredientIds));
  const ingredientsAppear = useMemo(
    () =>
      !order
        ? {}
        : order.ingredients.reduce<Record<string, number>>((acc, ingr) => {
            if (!acc[ingr]) acc[ingr] = 1;
            else acc[ingr] += 1;

            return acc;
          }, {}),
    [order]
  );

  const orderTotal = useMemo(
    () =>
      ingredientsSelector.reduce((acc, ingr) => {
        acc += ingredientsAppear[ingr._id] * ingr.price;

        return acc;
      }, 0),
    [ingredientsSelector]
  );

  useEffect(() => {
    if (!order) {
      void dispatch(getOrder(number!));
    }
  }, [number]);

  if (!order) {
    return <div>Заказ не найден!...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={`text text_type_digits-default mb-5 ${styles.textCenter}`}>
        {`#${order.number}`}
      </div>
      <div className={`text text_type_main-default ${styles.textLeft}`}>
        {order.name}
      </div>
      <div
        className={`text text_type_main-small text_color_inactive mb-5 ${styles.textLeft}`}
      >
        {order.status}
      </div>
      <div className={`text text_type_main-default mb-2 ${styles.textLeft}`}>
        {'Состав:'}
      </div>

      <div className={styles.ingredientsContainer}>
        {ingredientsSelector.map((ingr) => (
          <div className={styles.ingredientRow} key={ingr._id}>
            <div className={styles.ingredientLeft}>
              <img src={ingr.image} alt={ingr.name} className={styles.ingredientImage} />
              <span className={`text text_type_main-small ${styles.ingredientName}`}>
                {ingr.name}
              </span>
            </div>

            <div className={styles.ingredientRight}>
              <span
                className={`text text_type_digits-small ${styles.ingredientName}`}
              >{`${ingredientsAppear[ingr._id]} x ${ingr.price}`}</span>
              <CurrencyIcon type="primary" className={styles.ingredientIcon} />
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.totalRow} mt-4`}>
        <div
          className={`text text_type_main<-default mt-2 text_color_inactive${styles.textLeft}`}
        >
          <FormattedDate
            className={`text text_type_main-small text_color_inactive`}
            date={new Date(order.createdAt)}
          />
        </div>
        <div>
          <span className={`text text_type_digits-default mt-2 mr-1`}>{orderTotal}</span>
          <CurrencyIcon type="primary" className={styles.ingredientIcon} />
        </div>
      </div>
    </div>
  );
};
