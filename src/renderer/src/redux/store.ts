import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';  // Root reducer'ı birazdan oluşturacağız

const store = configureStore({
  reducer: rootReducer,
});

export default store;
