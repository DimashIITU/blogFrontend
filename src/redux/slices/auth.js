import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchUser = createAsyncThunk('auth/fetchUserData', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

export const fetchRegister = createAsyncThunk('registration/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params);
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchUser.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
    [fetchMe.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchMe.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
    [fetchRegister.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'loaded';
    },
    [fetchRegister.rejected]: (state) => {
      state.data = null;
      state.status = 'error';
    },
  },
});
export default authSlice.reducer;

export const { logout } = authSlice.actions;

export const isAuthType = (state) => Boolean(state.user.data);
