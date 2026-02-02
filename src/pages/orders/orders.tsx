import { OrderList } from '@/components/order-list/order-list';
import { connect, disconnect } from '@/services/history-orders/actions';
import { selectHistory, selectStatus } from '@/services/history-orders/slice';
import { useAppSelector } from '@/services/store';
import { HISTORY_ORDERS_SERVER_URL, WebsocketStatus } from '@/services/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './orders.module.css';

export const Orders = (): React.JSX.Element => {
  const orders_data = useAppSelector(selectHistory);
  const status = useAppSelector(selectStatus);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <main className={`${styles.main} pl-5 pr-5`}>
          <div className={styles.orders_container}>
            <OrderList
              list={orders_data.orders}
              url={HISTORY_ORDERS_SERVER_URL}
              routeDetail="profile/orders"
              connect={connect}
              disconnect={disconnect}
              statusFlag={true}
              isLoading={status !== WebsocketStatus.ONLINE}
            />
          </div>
        </main>
      </DndProvider>
    </>
  );
};
