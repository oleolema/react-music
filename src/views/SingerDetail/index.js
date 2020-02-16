import React, {Component, useState, useEffect} from 'react';
import {CSSTransition, TransitionGroup, SwitchTransition} from "react-transition-group";
import "./index.styl";
import {getArtistDetail} from "../../services/NetEaseAxios";
import {MusicList} from "../../components";
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";
import {useSpring, animated, useTransition} from 'react-spring'

function SingerDetail(props) {

    const [state, setState] = useState({
        ...props.location.state,
        id: props.match.params.id,
        list: []
    });
    //
    // const [animation, setAnimation] = useSpring(() => ({
    //     x: 100,
    // }));

    useEffect(() => {
        //查看路由是否携带数据
        if (!props.location.state) {
            props.history.push('/singer');
            return;
        }
        // setAnimation({
        //     ...animation,
        //     x: 0,
        // });
        getArtistDetail(state.id)
            .then(resp => {
                console.info(resp);
                setState({
                    ...state,
                    list: resp.data,
                });
            })
    }, []);


    // const style1 = {
    //     transform: animation.x.interpolate(x => `translate3d(${x}%,0,0)`),
    // };
    // const transitions = useTransition(state.id, p => p, {
    //     from: {opacity: 0, transform: 'translate3d(100%,0,0)'},
    //     enter: {opacity: 1, transform: 'translate3d(0%,0,0)'},
    //     leave: {opacity: 0, transform: 'translate3d(-50%,0,0)'},
    // });
    const artist = state.artist;
    if (!state.artist) {
        return (<></>)
    }
    return (<>
        {/*{transitions.map(({item, props, key}) => (*/}
        <div>
            <MusicList title={artist.name} bgImage={artist.picUrl} list={state.list}/>
        </div>
        {/*))}*/}
    </>)
}

export default connect(state => state, {dispatch})(SingerDetail);