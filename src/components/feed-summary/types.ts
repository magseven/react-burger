import type { TOrder } from '@utils/types';

export type TFeedSummaryProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};
