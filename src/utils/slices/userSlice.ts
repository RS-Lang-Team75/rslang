/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { getNewTokens } from '../queries/userQueries';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
const localSaveData = localStorage.getItem('client-info');
const storedUser = localSaveData ? (JSON.parse(localSaveData) as UserState) : undefined;
let newStoredUser: UserState | undefined;

const saveLocal = (state: UserState) => {
  localStorage.setItem('client-info', JSON.stringify(state));
};

if (storedUser && storedUser?.refreshToken) {
  getNewTokens(storedUser).then(res => {
    if (storedUser.token) {
      newStoredUser = structuredClone(storedUser);
      Object.defineProperties(newStoredUser, {
        token: {
          writable: true,
          value: res.token,
        },
        refreshToken: {
          writable: true,
          value: res.refreshToken,
        },
      });
      saveLocal(newStoredUser);
    }
  }).catch(() => {
    throw new Error('Failed to refresh tokens');
  });
}

const initialState: UserState = newStoredUser || storedUser || {
  token: '',
  refreshToken: '',
  userId: '',
  name: '',
};

export const userSlice = createSlice({
  name: 'userToken',
  initialState,
  reducers: {
    saveAll: (state, action: PayloadAction<UserState>) => {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
      state.refreshToken = action.payload.refreshToken;
      saveLocal(state);
    },
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

export const { saveToken, saveRefreshToken, saveName, saveUserId, saveAll } = userSlice.actions;

export default userSlice.reducer;
