import React, {Component, createRef} from 'react';
import './App.styl';
import {MHeader, Tab} from "./components";
import CacheRoute from 'react-router-cache-route'
import {Route, withRouter} from "react-router-dom";
import Routers from "./routers";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Player} from "./components";

class App extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div>
                <div className={'header-nav'}>
                    <MHeader/>
                    <Tab/>
                </div>

                <div id={'o-content'}>
                    <Routers/>
                </div>
                <Player/>


            </div>
        );
    }


}

export default withRouter(App);