/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

const storedUser: UserState = JSON.parse(localStorage.getItem('client-info') as string) as UserState;

const saveLocal = (state: UserState) => {
  localStorage.setItem('client-info', JSON.stringify(state));
};

const initialState: UserState = storedUser || {
  message: '',
  token: '',
  refreshToken: '',
  userId: '',
  name: '',
};

export const userSlice = createSlice({
  name: 'userToken',
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      saveLocal(state);
    },
    saveRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      saveLocal(state);
    },
    saveName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      saveLocal(state);
    },
    saveUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      saveLocal(state);
    },
  },
});

export const { saveToken, saveRefreshToken, saveName, saveUserId } = userSlice.actions;

export default userSlice.reducer;
