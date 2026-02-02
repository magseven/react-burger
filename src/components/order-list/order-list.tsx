import { useAppDispatch } from '@/services/store';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Order } from '../order/order';

import type { TFeedRow } from '@/services/types';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';

import styles from './order-list.module.css';

type TOrderListProps = {
  list: TFeedRow[];
  url: string;
  routeDetail: string;
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  statusFlag: boolean;
  isLoading: boolean;
};

export const OrderList = (props: TOrderListProps): React.JSX.Element => {
  const { list, url, routeDetail, connect, disconnect, statusFlag, isLoading } = props;
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connect(url));

    return (): void => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  console.log(isLoading);
  if (isLoading) return <div>Загружается список ингредиентов...</div>;

  return (
    <div className="mt-5 mb-5">
      <div className={styles.frame}>
        {list.map((row) => {
          return (
            <Link
              style={{ textDecoration: 'none', color: 'white' }}
              key={row._id}
              to={`/${routeDetail}/${row.number}`}
              state={{ backgroundLocation: location }}
            >
              <Order {...row} statusFlag={statusFlag} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
