import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import fastClick from "fastclick";
import './common/stylus/index.styl';
import {HashRouter as Router} from "react-router-dom";
import Test from "./Test";
import {Provider} from "react-redux";
import store from "./store";


// 轮播图的css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

fastClick.attach(document.body);


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
    , document.getElementById('root'));

//test


// ReactDOM.render(
//     <Test/>
//     , document.getElementById('test'));


serviceWorker.unregister();
