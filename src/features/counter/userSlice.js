import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  name: "",
  currentChatInfo: null,
  currentUserDocumentId : "",
}

export const userSlice = createSlice({
  name: 'userRdx',
  initialState,
  reducers: {
    setUserInRedux: (state, action) => {
        // console.log(action.payload,'action')
      state.user = action.payload;
    },
    setUserName: (state,action) => {
      state.name = action.payload.name;
    },
    setCurrentChatInfo: (state,action) => {
      state.currentChatInfo = action.payload.obj;
    },
    setCurrentUserDocumentID: (state,action) => {
      state.currentUserDocumentId = action.payload.val;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserInRedux,setUserName,setCurrentChatInfo,setCurrentUserDocumentID } = userSlice.actions

export default userSlice.reducer;
