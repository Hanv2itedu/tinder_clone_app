import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { Queue } from '../types/Queue';
import { User } from '../types/users';
import rootReducer from './usersReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blackList: [],
  whiteList: ['users'],
  migrate: (state: any) => {
    state.users.users = new Queue<User>(state.users.users);
    state.users.touchedUsers = new Queue<User>(state.users.touchedUsers);
    return Promise.resolve(state);
  },
};

const reducers = combineReducers({ users: rootReducer });

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true, // TODO: check in env if DEV
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;

export const persistor = persistStore(store);
