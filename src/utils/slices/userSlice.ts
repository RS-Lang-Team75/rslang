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

const initialState: UserState = {
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
    },
    saveRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    saveName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    saveUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { saveToken, saveRefreshToken, saveName, saveUserId } = userSlice.actions;

export default userSlice.reducer;
