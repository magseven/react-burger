import type { rootReducer, store } from './store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export enum WebsocketStatus {
  CONNECTING = 'CONNECTING...',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export type TFeedRow = {
  createdAt: string;
  ingredients: string[];
  name: string;
  number: number;
  status: string;
  updatedAt: string;
  _id: string;
  statusFlag: boolean;
};

export type TFeedList = {
  orders: TFeedRow[];
  total: number;
  totalToday: number;
};

export const ALL_ORDERS_SERVER_URL = 'wss://norma.education-services.ru/orders/all';
export const HISTORY_ORDERS_SERVER_URL = 'wss://norma.education-services.ru/orders';
