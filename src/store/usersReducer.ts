import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import moment from 'moment';
import { fetchUserDetail, fetchUsers, LIMIT } from '../services/userApi';
import { Queue } from '../types/Queue';
import { Status, User, UserDetail } from '../types/users';
import { RootState } from './configStore';

export interface UsersState {
  page: number; // cursor for back-end data, prevent load the user twice or more
  users: Queue<User>; // waitting queue
  touchedUsers: Queue<User>;
  userDetails: Record<string, UserDetail>; // user details: {id: UserDtail}
  isLoading: boolean;
  currentUser: User | null; //
  nextUser: User | null; //
  isLastPage: boolean;
}

const initialState: UsersState = {
  isLoading: false,
  page: 0,
  users: new Queue<User>(),
  currentUser: null,
  nextUser: null,
  isLastPage: false,
  touchedUsers: new Queue<User>(),
  userDetails: {},
};

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 0): Promise<{ data: User[]; total: number }> => {
    const { data = [], total } = await fetchUsers(page);
    return { data, total };
  },
);

export const fetchUserDetailAsync = createAsyncThunk(
  'users/fetchUserDetail',
  async (userId: string): Promise<UserDetail> => {
    const response = await fetchUserDetail(userId);
    return response;
  },
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    dequeueUser: state => {
      state.users.dequeue();
    },
    enqueueHistory: (state, action) => {
      action.payload && state.touchedUsers.enqueue(action.payload);
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        const { total, data = [] } = action.payload;
        state.isLoading = false;
        state.isLastPage = (state.page + 1) * LIMIT >= total;
        if (action.payload?.data?.length) {
          state.page += 1;
          state.users.enqueues(data);
        }
      })
      .addCase(fetchUsersAsync.rejected, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserDetailAsync.fulfilled, (state, action) => {
        const { id, dateOfBirth } = action.payload;
        state.isLoading = false;
        state.userDetails[id] = {
          ...action.payload,
          age: moment().diff(dateOfBirth, 'year'),
        };
      });
  },
});

export const currentUserSelector = (state: RootState) =>
  state.users.users.peek();
export const nextUserSelector = (state: RootState) =>
  state.users.users.peekNext();
export const touchedUsersSelector = (state: RootState) => ({
  touchedUsers: state.users.touchedUsers,
  head: state.users.touchedUsers.getHead(),
});
export const pagingSelector = (state: RootState) => ({
  page: state.users.page,
  isLastPage: state.users.isLastPage,
  queueLength: state.users.users.length,
});

export const userDetaisSelector = (state: RootState) => state.users.userDetails;

export const { dequeueUser, enqueueHistory } = usersSlice.actions;
export default usersSlice.reducer;

export const onSwipe =
  (status: Status) =>
  (
    dispatch: (arg0: { payload: undefined; type: string }) => void,
    getState: () => RootState,
  ) => {
    const _currentUser = currentUserSelector(getState());
    dispatch(enqueueHistory({ ..._currentUser, status }));
    dispatch(dequeueUser());
  };
