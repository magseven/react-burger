import type { rootReducer, store } from './store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

// export type AppThunk<ReturnType = void> = (
//   dispatch: AppDispatch,
//   getState: () => RootState
// ) => ReturnType;
