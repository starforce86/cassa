import { combineReducers } from 'redux';
import auth from './auth';
import company from './company';
import lookup from './lookup';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
 
const rootReducer = {
    auth: auth,
    company: company,
    lookup: lookup
}

const persistConfig = {
    key: 'root',
    storage,
  }
  
const persistedReducer = persistCombineReducers(persistConfig, rootReducer);
 
export default persistedReducer;