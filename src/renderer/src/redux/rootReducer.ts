import { combineReducers } from 'redux';
import exampleReducer from './exampleSlice';

const rootReducer = combineReducers({
  example: exampleReducer,
});

export default rootReducer;
