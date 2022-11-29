import { createStore, combineReducers } from 'redux';
import listasReducer from '../reducers/listasReducer';

const store = createStore(
  combineReducers({
    listas: listasReducer,
  })
);
