import { createSlice } from "@reduxjs/toolkit";

export const userslice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: true,
  },
  reducers: {
    login: (state, action) => {
      console.log("[DEBUG-REDUX] login reducer called with payload:", action.payload);
      state.user = action.payload;
    },
    logout: (state) => {
      console.log("[DEBUG-REDUX] logout reducer called");
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
