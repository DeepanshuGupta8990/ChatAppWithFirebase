import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/counter/userSlice'
import chatReducer from '../features/counter/chatSlice';

// Combine multiple reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  userRdx: userReducer,
  chatRdx: chatReducer
  // Add more reducers here if needed
});

// Create the Redux store
export const store = configureStore({
  reducer: rootReducer,
});
