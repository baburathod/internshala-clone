import { createSlice } from "@reduxjs/toolkit";

export const userslice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: true,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
export const { login, logout, setLoading } = userslice.actions;
export const selectuser = (state) => state.user.user;
export const selectIsLoading = (state) => state.user.isLoading;
export default userslice.reducer;
