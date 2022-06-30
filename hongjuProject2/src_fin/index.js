import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import RootRouter from './RootRouter';
import './../src/components/common/Loading';

import './index.scss';

ReactDOM.render(
    <Provider store={store}>
        <RootRouter/>
    </Provider>,
    document.getElementById('root')
);
