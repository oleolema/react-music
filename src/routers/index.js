import React from "react";

import * as com from "../views";
import {Redirect, withRouter} from "react-router-dom";
import {Switch, Route} from "react-router-dom";
import classNames from "classnames";
import AnimationRoute from "./AnimationRoute";


import {CacheRoute, CacheSwitch} from "react-router-cache-route";

import './index.styl';
import {CSSTransition, TransitionGroup, SwitchTransition} from "react-transition-group";


export default withRouter((props) => (
    <>

        <div style={{display: "none"}}>{console.info(props.location.pathname)}</div>

        <CacheSwitch>
            <CacheRoute path={'/'} exact component={() => (<Redirect to={'/recommend'}/>)}/>
            <CacheRoute path={'/recommend'} component={com.Recommend}/>
            <CacheRoute path={'/rank'} component={com.Rank}/>
            <CacheRoute path={'/search'} component={com.Search}/>
            <CacheRoute path={'/singer'} component={com.Singer}/>

        </CacheSwitch>

        <AnimationRoute>
            <Route path={'/singer/:id'} component={com.SingerDetail} exact/>
        </AnimationRoute>

        <AnimationRoute>
            <Route path={'/recommend/:id'} component={com.DiscDetail} exact/>
        </AnimationRoute>

        <AnimationRoute>
            <Route path={'/rank/:id'} component={com.RankDetail} exact/>
        </AnimationRoute>

        <AnimationRoute>
            <Route path={'/search/:word'} component={com.SearchDetail} exact/>
        </AnimationRoute>


    </>

));