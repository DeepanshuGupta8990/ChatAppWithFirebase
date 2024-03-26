import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  name: "",
  currentChatInfo: null,
  currentUserDocumentId : "",
  isLoadingtrue : false,
  loadingPercentage: 0,
  userImageUrl : null,
  currentChatUserInfo: {}
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
    },
    setLoadingBar: (state,action) => {
      state.isLoadingtrue = action.payload.val;
    },
    setLoadingPercentage: (state,action) =>{
      state.loadingPercentage = action.payload.val;
    },
    setUserImageUrl: (state,action) =>{
      state.userImageUrl = action.payload.val;
    },
    setCurretnChatUSerInfo: (state,action) => {
      state.currentChatUserInfo = action.payload.val
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserInRedux,setUserName,setCurrentChatInfo,setCurrentUserDocumentID,setLoadingBar,setLoadingPercentage,setUserImageUrl,setCurretnChatUSerInfo } = userSlice.actions

export default userSlice.reducer;
