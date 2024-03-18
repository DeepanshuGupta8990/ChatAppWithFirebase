import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'userRdx',
  initialState,
  reducers: {
    setUserInRedux: (state, action) => {
        // console.log(action.payload,'action')
      state.user = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserInRedux } = userSlice.actions

export default userSlice.reducer;
