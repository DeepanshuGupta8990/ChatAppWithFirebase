import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chatId: '1',
}

export const chatSlice = createSlice({
  name: 'chatRdx',
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload.id;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChatId } = chatSlice.actions

export default chatSlice.reducer;
