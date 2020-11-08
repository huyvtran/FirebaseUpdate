import { compose, createStore, applyMiddleware, Store } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './middleware/saga/rootSaga';
import rootReducer from './reducers/appReducer';
import thunk from 'redux-thunk';
import IReduxStore from './IReduxStore';
const persistConfig = {
    key: 'abivin',
    storage: AsyncStorage,
    // blacklist: ['nav', 'trackLocation']
    whitelist: ['i18n', 'org', 'user', 'device', 'metadata']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();


// Load middleware
let middleware = [
    sagaMiddleware, // Allows action creators to return functions (not just plain objects)
    thunk
];

if (__DEV__) {
    // Dev-only middleware
    middleware = [
        ...middleware,
        createLogger(), // Logs state changes to the dev console
    ];
}
const store:Store<IReduxStore> = createStore(persistedReducer, undefined, compose(applyMiddleware(...middleware)));
sagaMiddleware.run(rootSaga);

persistStore(store);

export default store;

