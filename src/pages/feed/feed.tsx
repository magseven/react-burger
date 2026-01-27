import { FeedSummary } from '@/components/feed-summary/feed-summary';
import { OrderList } from '@/components/order-list/order-list';
import { connect, disconnect } from '@/services/feed-orders/actions';
import { selectFeed, selectStatus } from '@/services/feed-orders/slice';
import { useAppSelector } from '@/services/store';
import { ALL_ORDERS_SERVER_URL, WebsocketStatus } from '@/services/types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './feed.module.css';
export const Feed = (): React.JSX.Element => {
  const orders_data = useAppSelector(selectFeed);
  const status = useAppSelector(selectStatus);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Лента заказов
        </h1>

        <main className={`${styles.main} pl-5 pr-5`}>
          <div className={styles.orders_container}>
            <OrderList
              list={orders_data.orders}
              url={ALL_ORDERS_SERVER_URL}
              routeDetail="feed"
              connect={connect}
              disconnect={disconnect}
              statusFlag={false}
              isLoading={status !== WebsocketStatus.ONLINE}
            />
          </div>
          <div className={styles.feedsummary_container}>
            <FeedSummary {...orders_data} />
          </div>
        </main>
      </DndProvider>
    </>
  );
};
