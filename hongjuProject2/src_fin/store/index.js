import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import logger from 'redux-logger'

import Immutable from 'immutable';
//Immutable支持
const state = Immutable.fromJS({});
const store = reducer(state);

const other = [];
const middleware = process.env.NODE_ENV === 'production'
	? [...other, thunk]
	: [...other, thunk];//[...other, thunk,  logger()];
const createStoreWithThunk = applyMiddleware(...middleware)(createStore);

//浏览器 Redux 插件支持 详见https://github.com/zalmoxisus/redux-devtools-extension#usage
const composeEnhancers =
	typeof window === 'object' &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		}) : compose;

const enhancer = composeEnhancers(
	// applyMiddleware(...middleware),
	// other store enhancers if any
);


export default process.env.NODE_ENV === 'production'
	? createStoreWithThunk(reducer, store)
	: createStoreWithThunk(reducer, store, enhancer);

