import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchUserDetail, fetchUsers } from '../services/userApi';
import { Queue } from '../types/Queue';
import { User, UserDetail } from '../types/users';

export interface UsersState {
  page: number; // cursor for back-end data, prevent load the user twice or more
  users: Queue<User>; // waitting queue
  // touchedUsers: Queue<User>;
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
  // touchedUsers: new Queue<User>(),
  userDetails: {},
};

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 0): Promise<User[]> => {
    const response = await fetchUsers(page);
    return response.data;
  },
);

const fetchUserDetailAsync = createAsyncThunk(
  'users/fetchUserDetail',
  async (userId: string): Promise<UserDetail> => {
    const response = await fetchUserDetail(userId);
    return response.data;
  },
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getCurrentUser: state => {
      state.currentUser = state.users.peek();
    },
    getNextUser: state => {
      state.nextUser = state.users.peekNext();
    },
    dequeueUser: state => {
      state.users.dequeue();
      state.currentUser = state.users.peek();
      state.nextUser = state.users.peekNext();
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.length) {
          state.page += 1;
          state.users.enqueues(action.payload || []);
        } else {
          state.isLastPage = true;
        }
      })
      .addCase(fetchUsersAsync.rejected, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserDetailAsync.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.isLoading = false;
        state.userDetails[id] = {
          ...action.payload,
          fetchedDate: new Date().toISOString(),
        };
      });
  },
});

export const currentUserSelector = (state: UsersState) => state.users.peek();
export const nextUserSelector = (state: UsersState) => state.users.peekNext();
export const pagingSelector = (state: UsersState) => ({
  page: state.page,
  isLastPage: state.isLastPage,
  queueLength: state.users.length,
});

export const { getNextUser, getCurrentUser, dequeueUser } = usersSlice.actions;
export default usersSlice.reducer;

export const onSwipe =
  (isLeft: boolean) =>
  (
    dispatch: (arg0: { payload: undefined; type: string }) => void,
    // getState: () => UsersState,
  ) => {
    //const _currentUser = currentUserSelector(getState());
    if (isLeft) {
    }
    dispatch(dequeueUser());
  };
