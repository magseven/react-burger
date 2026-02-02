import { refreshToken } from '@/utils/api.ts';

import type { RootState } from '../store.ts';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import type { Middleware } from 'redux';

type TWsActionTypes<R, S> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
  sendMessage?: ActionCreatorWithPayload<S>;
};

const RECONNECT_TIMEOUT = 3000;

export const socketMiddleware = <R, S>(
  wsActions: TWsActionTypes<R, S>,
  withTokenRefresh = false
): Middleware<NonNullable<unknown>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const {
      connect,
      disconnect,
      onConnecting,
      onOpen,
      onClose,
      onError,
      onMessage,
      sendMessage,
    } = wsActions;
    const { dispatch } = store;
    let isConnected = false;
    let url = '';
    let reconnectTimer = 0;

    return (next) => (action) => {
      console.log(action);
      if (connect.match(action)) {
        socket = new WebSocket(action.payload);
        url = action.payload;
        onConnecting && dispatch(onConnecting());
        isConnected = true;

        socket.onopen = (): void => {
          onOpen && dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('WebSocket error'));
        };

        socket.onclose = (): void => {
          onClose && dispatch(onClose());

          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_TIMEOUT);
          }
        };

        socket.onmessage = (event): void => {
          try {
            const raw: string =
              typeof event.data === 'string' ? event.data : String(event.data);
            const data = JSON.parse(raw) as { message: string } | R;
            console.log('IMHREE', withTokenRefresh, data);

            if (
              withTokenRefresh &&
              typeof data === 'object' &&
              data !== null &&
              'message' in data &&
              data.message === 'Invalid or missing token'
            ) {
              refreshToken()
                .then((refreshedData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshedData.accessToken.replace('Bearer ', '')
                  );
                  dispatch(connect(wssUrl.toString()));
                })
                .catch((err) => {
                  dispatch(onError((err as Error).message));
                });

              dispatch(disconnect());

              return;
            }
            dispatch(onMessage(data as R));
          } catch (e) {
            dispatch(onError((e as Error).message));
          }
        };

        return;
      }

      if (socket && disconnect.match(action)) {
        clearTimeout(reconnectTimer);
        socket.close();
        socket = null;
        isConnected = false;
        return;
      }

      if (socket && sendMessage?.match(action)) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (e) {
          dispatch(onError((e as Error).message));
        }
        return;
      }

      next(action);
    };
  };
};
